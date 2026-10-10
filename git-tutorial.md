
# git常用命令

上游仓库为：
HTTPS: https://github.com/hexiongwu1995/itemplate.git

## 一、配置与初始化

```powershell
git init
# 在当前目录初始化一个新的 Git 仓库

git config --global user.name "你的名字"
# 设置全局用户名（提交记录会显示）

git config --global user.email "你的邮箱"
# 设置全局用户邮箱

git config --list
# 查看当前所有 Git 配置

git clone https://github.com/hexiongwu1995/itemplate.git
# 克隆远程仓库到本地（默认在当前目录创建 itemplate 文件夹）

git clone https://github.com/hexiongwu1995/itemplate.git 自定义文件夹名
# 克隆远程仓库并指定本地文件夹名称

git clone https://github.com/hexiongwu1995/itemplate.git .
# 克隆到当前目录（. 表示当前目录，不新建文件夹；要求当前目录为空，否则报错）

git clone https://github.com/hexiongwu1995/itemplate.git D:\projects\itemplate
# 克隆到指定的绝对路径（文件夹不存在时会自动创建）

git clone . D:\projects\itemplate
# 将当前目录已初始化的仓库克隆到指定文件夹

git clone -b 分支名 https://github.com/hexiongwu1995/itemplate.git
# 克隆远程仓库的指定分支

git clone --depth 1 https://github.com/hexiongwu1995/itemplate .
# 浅克隆（只拉取最近 1 次提交的历史），速度快、体积小，适合只想获取最新代码的场景

git fetch --deepen 10
# 在浅克隆基础上补充最近 10 次提交的历史记录（逐步加深本地历史深度）

```

## 二、基础操作

```powershell
git status
# 查看工作区、暂存区的状态（哪些文件被修改/新增）

git add 文件名
# 将指定文件的修改加入暂存区

git add .
# 将所有修改的文件加入暂存区

git commit -m "提交说明"
# 将暂存区的内容提交到本地仓库

git commit -am "提交说明"
# 跳过 add，直接将所有已跟踪文件的修改提交

git log
# 查看完整的提交历史

git log --oneline
# 以简洁的单行形式查看提交历史

git diff
# 查看工作区与暂存区之间的差异

git diff --staged
# 查看暂存区与最近一次提交之间的差异
```

## 三、分支操作

```powershell
git branch
# 查看本地所有分支

git branch -a
# 查看本地和远程的所有分支

git branch 分支名
# 创建一个新分支

git checkout 分支名
# 切换到指定分支

git checkout -b 分支名
# 创建并切换到新分支

git switch 分支名
# 切换到指定分支（新版推荐的写法）

git switch -c 分支名
# 创建并切换到新分支（新版推荐的写法）

git branch -d 分支名
# 删除已合并的分支

git branch -D 分支名
# 强制删除分支（即使未合并）
```

## 四、远程仓库

```powershell
git remote -v
# 查看已配置的远程仓库地址

git remote add origin https://github.com/hexiongwu1995/itemplate.git
# 添加名为 origin 的远程仓库

git remote set-url origin https://github.com/hexiongwu1995/itemplate.git
# 修改远程仓库 origin 的地址

git fetch
# 拉取远程仓库的最新信息，但不合并到本地

git pull
# 拉取远程仓库的更新并合并到当前分支（= fetch + merge）

git push
# 将本地当前分支的提交推送到远程仓库

git push -u origin 分支名
# 首次推送分支并建立跟踪关系（之后可直接 git push）

git push origin --delete 分支名
# 删除远程仓库上的指定分支
```

## 五、合并与变基

```powershell
git merge 分支名
# 将指定分支合并到当前分支

git merge --no-ff 分支名
# 合并分支并保留合并节点（生成 merge commit）

git rebase 分支名
# 将当前分支的提交变基到指定分支之上

git cherry-pick 提交ID
# 将某一次指定的提交应用到当前分支

git log --graph --oneline
# 以图形化方式查看分支合并历史
```

## 六、撤销与回退

```powershell
git restore 文件名
# 撤销工作区中指定文件的修改（未 add 的）

git restore --staged 文件名
# 将文件从暂存区撤出（保留修改内容）

git checkout -- 文件名
# 撤销工作区中指定文件的修改（旧版写法）

git reset --soft HEAD~1
# 回退最近一次提交，修改保留在暂存区

git reset --mixed HEAD~1
# 回退最近一次提交，修改保留在工作区（默认）

git reset --hard HEAD~1
# 彻底回退最近一次提交，修改全部丢弃（慎用）

git revert 提交ID
# 生成一次新提交来抵消指定提交（安全，适合已推送的提交）
# `提交ID` 就是目标提交的哈希值，可以用`git log` 查到，通常写前 7 位即可
```

## 七、暂存与储藏（stash）

```powershell
git stash
# 将当前未提交的修改临时储藏起来，恢复干净的工作区

git stash list
# 查看所有储藏记录

git stash pop
# 恢复最近一次储藏的修改，并删除该储藏记录

git stash apply
# 恢复最近一次储藏的修改，但保留该储藏记录

git stash drop
# 删除最近一次的储藏记录
```

## 八、标签（tag）

```powershell
git tag
# 查看所有标签

git tag v1.0.0
# 在当前提交上创建一个标签

git tag -a v1.0.0 -m "版本说明"
# 创建带说明的附注标签

git push origin v1.0.0
# 将指定标签推送到远程仓库

git push origin --tags
# 将所有本地标签推送到远程仓库

git tag -d v1.0.0
# 删除本地标签

git push origin --delete v1.0.0
# 删除远程仓库上的标签（推荐写法，Git 1.7.0+）

git push origin :refs/tags/v1.0.0
# 删除远程仓库上的标签（旧写法，推送空引用）

git tag -f v0.4.0 
# 强制把 tag 移到最新提交 

git push -f origin v0.4.0 
# 覆盖远端 tag → 触发 workflow 重跑

```
