# Git 历史清理：只保留最近 N 条 commit

> 适用场景：仓库体积被旧历史中的大文件撑大（已删除的 PDF、纹理、视频等二进制文件仍留在历史中），
> 且不再需要早期提交记录。本流程将第 N 条 commit 变为新的根提交，删除其之前的全部历史。
>
> 实测效果：`.git` 从 95.55 MiB 降到 1.07 MiB（114 条 commit → 10 条）。
>
> 环境：Windows PowerShell（如用 bash，把 `Write-Host` 换成 `echo`，其余通用）。

## 原理

1. 用 `git commit-tree` 把目标 commit 的文件快照做成一个无父提交（新根）
2. 用 `git rebase --onto` 把它之后的提交原样重放到新根上
3. force push 后再做引用清理 + `git gc`，旧对象才会真正删除

## 操作步骤

### 第 0 步：确认状态

```powershell
git status              # 必须是 clean，且在目标分支上
git log --oneline       # 数清楚要保留到哪一条，记下它的哈希
```

### 第 1 步：备份（必做）

```powershell
# 导出完整历史到仓库外；恢复方法见文末
git bundle create "$env:TEMP\repo-backup.bundle" --all
git bundle verify "$env:TEMP\repo-backup.bundle"   # 显示 complete history 才算成功
```

### 第 2 步：创建新根提交

```powershell
# ===== 参数：改成你要保留的第一条 commit 的哈希 =====
$target = "3d341e5"

# 用它的文件快照创建无父提交，提交信息自拟
$newRoot = git commit-tree "$target^{tree}" -m "refactor the codebase"
Write-Host "新根提交: $newRoot"
```

> 注意：`$newRoot = git ...` 和后面的使用必须在同一个会话中；
> 粘贴命令时不要把两行合并成一行，否则参数会传错。
> 新根的作者/日期是当前时间，原提交的作者信息不保留。

### 第 3 步：重放后续提交

```powershell
git rebase --onto $newRoot $target main
```

因为新根的文件内容与 `$target` 完全一致，重放不会产生冲突。
完成后 commit 哈希全部改变，属正常现象。

### 第 4 步：验证

```powershell
git log --oneline                     # 应只剩 N 条
git diff $target $newRoot --stat      # 应无输出，证明根提交内容与原 commit 完全一致
```

### 第 5 步：重指 tag（如有 tag 指向被重写的提交）

```powershell
git tag -f v0.4.0 HEAD~1     # 按实际位置调整；或 git tag -d 删掉不要的 tag
```

### 第 6 步：force push

```powershell
git push --force-with-lease origin main
git push --force origin v0.4.0      # 有 tag 才需要
```

> `--force-with-lease` 比 `--force` 安全：若远程在此期间有别人推送会拒绝。
> 推送后 GitHub 网页显示的仓库体积不会立即变小，服务端 GC 有数周延迟，急需可联系 GitHub Support。

### 第 7 步：清理本地旧对象（必须在 push 之后，顺序不能颠倒）

`origin/main` 等引用仍指向旧历史，先清理是删不掉的。

```powershell
git fetch --prune
git update-ref -d ORIG_HEAD        # rebase 留下的伪引用，不删会导致旧对象无法回收
git reflog expire --expire=now --expire-unreachable=now --all
git gc --prune=now --aggressive
```

### 第 8 步：验证体积

```powershell
git count-objects -vH    # size-pack 应大幅下降
git log --oneline        # 确认提交数正确
```

## 恢复方法（backup bundle）

```powershell
git clone "$env:TEMP\repo-backup.bundle" 恢复目录名
```

## 变体：只保留当前文件（1 条 commit，最简）

如果连最近 N 条的历史也不要，只要最新代码状态：

```powershell
git bundle create "$env:TEMP\repo-backup.bundle" --all   # 备份
git checkout --orphan fresh
git commit -m "init"
git branch -M main                 # 用新分支替换 main
git tag -f v0.4.0                  # 如有 tag
git push --force-with-lease origin main
git push --force origin v0.4.0
git reflog expire --expire=now --all
git gc --prune=now
```

## 注意事项

1. **重写历史是破坏性操作**：所有协作者的旧克隆会失效，需要重新 clone；
   旧克隆执行 pull/push 会报历史分叉错误。
2. **CI/CD 触发**：若仓库配置了 push/tag 触发的 workflow（如自动发布 npm），
   force push 和重建 tag 可能触发流水线，推送前先确认触发条件。
3. **tag 是可达性根**：指向旧历史的 tag 必须删除或重指，否则对应旧对象无法被 GC。
4. 备份 bundle 不要放在 Temp 目录长期保存（系统会清理），确认无误后再决定删除或归档。
