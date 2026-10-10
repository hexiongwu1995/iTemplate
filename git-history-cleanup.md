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
git status
# 查看工作区与暂存区的当前状态
# 必须显示 nothing to commit, working tree clean：工作区干净才能安全地重写历史
# 同时确认当前分支就是要操作的目标分支（如 main）

git log --oneline
# 以每条 commit 一行的简洁格式列出提交历史（新→旧排列）
# 数清楚要保留最近多少条提交，找到边界处那条 commit
# 记下它的哈希（如 3d341e5），后续步骤都要用它
```

### 第 1 步：备份（必做）

```powershell
# 导出完整历史到仓库外；恢复方法见文末

git bundle create "$env:TEMP\repo-backup.bundle" --all
# 把整个仓库（所有分支、tag、完整历史）打包成单个 bundle 备份文件
# $env:TEMP 是 Windows 临时目录，备份放在仓库外，避免被后续清理波及
# bundle 是重写历史前唯一可靠的"后悔药"，此步不能跳过

git bundle verify "$env:TEMP\repo-backup.bundle"
# 校验刚生成的 bundle 文件是否完整可用
# 输出末尾必须显示 complete history 才算备份成功，否则重新执行上一条命令
```

### 第 2 步：创建新根提交

```powershell
# ===== 参数：改成你要保留的第一条 commit 的哈希 =====

$target = "3d341e5"
# 定义变量 $target，指向清理后历史中最老的那条 commit（第 0 步记下的哈希）
# 这条 commit 及其之后的所有提交都会被保留，之前的全部删除

$newRoot = git commit-tree "$target^{tree}" -m "refactor the codebase"
# 核心命令：基于 $target 指向的文件快照（tree 对象）创建一个全新的提交
# $target^{tree}：解引用 $target 提交，拿到它对应的目录树（即当时的全部文件内容快照）
# commit-tree 是底层命令，创建的提交没有任何父提交，因此成为新的根提交
# -m 后跟新根提交的提交信息，可自拟
# git 会输出新提交的哈希，赋值给变量 $newRoot 供后续步骤使用

Write-Host "新根提交: $newRoot"
# 在终端打印新根提交的哈希，确认创建成功并方便记下它
```

> 注意：`$newRoot = git ...` 和后面的使用必须在同一个会话中；
> 粘贴命令时不要把两行合并成一行，否则参数会传错。
> 新根的作者/日期是当前时间，原提交的作者信息不保留。

### 第 3 步：重放后续提交

```powershell
git rebase --onto $newRoot $target main
# 把 main 分支上 $target 之后的提交逐条"重放"到新根 $newRoot 之上

# 三个参数的含义：
#   --onto $newRoot —— 重放后的提交要接在哪个新基底上（即第 2 步创建的无父根提交）
#   $target         —— 重放的起点（不含）：只搬 $target 之后的提交，$target 本身被新根替代
#   main            —— 要重写历史的目标分支

# 执行过程：依次取出 $target..main 区间的每条提交，按原顺序逐条
# 应用到 $newRoot 上，每条都生成一个内容相同但哈希不同的新提交
# 因为新根的文件内容与 $target 完全一致，重放不会产生冲突
# 完成后 main 的旧历史断开，commit 哈希全部改变，属正常现象
```


### 第 4 步：验证

```powershell
git log --oneline
# 以每条 commit 一行的格式列出 main 的提交历史
# 预期结果：只剩 N 条，最底部一条就是新根提交（提交信息为自拟的那条）
# 若条数不对，说明 rebase 范围有误，可从备份 bundle 恢复后重做

git diff $target $newRoot --stat
# 比较旧边界提交 $target 与新根提交 $newRoot 的文件差异
# --stat 表示只输出变更统计（文件名 + 增删行数），不展示具体内容
# 预期结果：无任何输出，证明新根的文件快照与原 commit 完全一致
# 若有输出，说明第 2 步 commit-tree 用错了对象，不要继续后续步骤
```

### 第 5 步：重指 tag（如有 tag 指向被重写的提交）

```powershell
git tag -f v0.4.0 HEAD~1
# -f 表示强制：把已有 tag v0.4.0 重新指到 HEAD~1（当前 HEAD 的上一条提交）
# rebase 后哈希全部改变，旧 tag 仍指向旧历史的提交，必须重指或删除
# HEAD~1 只是示例，tag 应指向的位置按实际结构调整（可用 git log 确认）
# 若这个 tag 不再需要，可改用 git tag -d v0.4.0 直接删除
# 此步不可跳过：tag 是可达性根，不处理则旧对象无法被 GC（见文末注意事项）
# GC = Garbage Collection（垃圾回收），指 git gc 命令执行的清理机制：
#   Git 只回收"不可达"对象——从任何分支、tag、HEAD、reflog 都无法引用到的对象
#   tag 仍指向旧提交，Git 就认为它是可达的，永远不会删除；
#   只有重指或删除 tag 后，对应的旧对象才被标记为不可达，gc 时才会真正回收
```

### 第 6 步：force push

```powershell
git push --force-with-lease origin main
# 把重写后的 main 强制推送到远程 origin
# 本地与远程历史已分叉（哈希全变），普通 push 会被拒绝，必须强制覆盖
# --force-with-lease 是安全版强推：仅当远程 main 仍停在你本地记录的位置时才推送
# 若期间有协作者推了新提交，推送会被拒绝，避免覆盖别人的工作

git push --force origin v0.4.0
# 强制推送被重指的 tag v0.4.0（第 5 步改过指向，需覆盖远程旧 tag）
# 只有重指过 tag 才需要执行这条，没动过 tag 可跳过
# tag 用 --force 即可：tag 通常由维护者独管，一般不存在协作冲突风险
```

> `--force-with-lease` 比 `--force` 安全：若远程在此期间有别人推送会拒绝。
> 推送后 GitHub 网页显示的仓库体积不会立即变小，服务端 GC 有数周延迟，急需可联系 GitHub Support。

### 第 7 步：清理本地旧对象（必须在 push 之后，顺序不能颠倒）

`origin/main` 等引用仍指向旧历史，先清理是删不掉的。

```powershell
git fetch --prune
# 从远程 origin 拉取最新引用，让本地的远程跟踪引用与远程保持同步
# --prune：删除远程已不存在的远程跟踪引用（如别人已删掉的 origin/xxx 分支）
# 作用：force push 后让 origin/main 指向新历史，不再保护旧提交
# 本地残留的指向旧历史的远程跟踪引用同样是"可达性根"，不清掉旧对象就无法被 GC

git update-ref -d ORIG_HEAD
# 删除 ORIG_HEAD 这个伪引用
# ORIG_HEAD 是 rebase/merge/reset 等操作前自动记录的"操作前位置"，
# 它不属于任何分支，但第 3 步 rebase 后它仍指向旧历史的顶端提交
# 只要它存在，git gc 就会认为旧提交仍然可达，永远不会回收，必须显式删除

git reflog expire --expire=now --expire-unreachable=now --all
# 清空 reflog（引用日志），解除 reflog 对旧提交的保护
# reflog 会记录 HEAD 和各分支曾经指向过的每个位置，默认保留 90 天，
# 期间这些旧提交都被视为可达，GC 不会回收它们
# --expire=now：所有 reflog 记录立即过期，不论新旧、不论是否可达
# --expire-unreachable=now：不可达提交的记录也立即过期（默认另有 30 天宽限）
# --all：作用于所有引用（HEAD、全部分支），而不只是当前 HEAD

git gc --prune=now --aggressive
# 垃圾回收：整理对象库，把不可达对象真正从磁盘删除
# 前面几步只是"解除保护"，让旧对象变为不可达；这一步才执行实际删除
# --prune=now：立即回收全部不可达对象（默认保留 2 周宽限期，防止误删）
# --aggressive：深度压缩包文件，体积更小但耗时更长
# 执行完后旧历史才真正从 .git 消失，用第 8 步的命令验证体积变化
```

### 第 8 步：验证体积

```powershell
git count-objects -vH
# 统计 Git 对象数据库的体积并以人类可读单位（KiB/MiB）显示
# -v：输出详细统计（对象数量、包文件大小等）；-H：以人类可读格式显示
# 关注其中的 size-pack 字段：它是打包后的仓库数据体积，清理后应大幅下降

git log --oneline
# 以每条 commit 一行的简洁格式列出提交历史
# 用来确认清理后的提交数量正确，且第一条已是新的根提交
```

## 恢复方法（backup bundle）

```powershell
git clone "$env:TEMP\repo-backup.bundle" 恢复目录名
```

## 变体：只保留当前文件（1 条 commit，最简）

如果连最近 N 条的历史也不要，只要最新代码状态：

```powershell
git bundle create "$env:TEMP\repo-backup.bundle" --all
# 备份：把整个仓库（所有分支、tag、完整旧历史）打包到仓库外的单个文件
# 下面的流程会丢弃全部旧历史，这一步是唯一的"后悔药"，不能跳过

git checkout --orphan fresh
# 创建并切换到"孤儿分支" fresh：没有任何父提交、也不含任何文件的新分支
# --orphan 的关键在于：新分支不继承任何历史，但工作区的文件原样保留
# 此时所有文件都处于"待提交"状态（相当于刚 add 完）

git commit -m "init"
# 把工作区的当前文件状态提交为 fresh 分支的第一个提交
# 这个提交没有父提交，就是全新的根提交，历史从此只有这 1 条
# 工作区文件内容与提交前完全一致，代码没有任何改动

git branch -M main
# 用 fresh 分支强制重命名为 main，替换掉旧的 main 分支
# -M = -m + -f：重命名并强制覆盖同名分支
# 旧 main 及其全部历史就此失去引用，后续由 reflog expire + gc 负责回收

git tag -f v0.4.0
# 把已有 tag v0.4.0 强制重指到当前 HEAD（新根提交）
# 仅在确实存在这个 tag 时执行；tag 指向旧历史会导致旧对象无法被 GC
# 若这个 tag 不再需要，改用 git tag -d v0.4.0 删除即可

git push --force-with-lease origin main
# 强制推送全新的 main 到远程，覆盖远程的全部旧历史
# 本地与远程历史已完全分叉，普通 push 会被拒绝，必须强制
# --force-with-lease 是安全版强推：远程若有别人的新推送会被拒绝，避免误覆盖

git push --force origin v0.4.0
# 强制推送重指后的 tag v0.4.0，覆盖远程旧 tag
# 只有第 5 行真的重指/存在 tag 时才需要；没动过 tag 可跳过

git reflog expire --expire=now --all
# 清空所有引用的 reflog，解除对旧提交的最后保护
# 否则旧 main 的提交仍被 reflog 引用（默认保留 90 天），GC 不会回收

git gc --prune=now
# 垃圾回收：立即删除所有不可达对象（即全部旧历史），缩减 .git 体积
# 此变体没有 rebase，不会产生 ORIG_HEAD，无需第 7 步的其他清理命令
```

## 注意事项

1. **重写历史是破坏性操作**：所有协作者的旧克隆会失效，需要重新 clone；
   旧克隆执行 pull/push 会报历史分叉错误。
2. **CI/CD 触发**：若仓库配置了 push/tag 触发的 workflow（如自动发布 npm），
   force push 和重建 tag 可能触发流水线，推送前先确认触发条件。
3. **tag 是可达性根**：指向旧历史的 tag 必须删除或重指，否则对应旧对象无法被 GC。
4. 备份 bundle 不要放在 Temp 目录长期保存（系统会清理），确认无误后再决定删除或归档。
