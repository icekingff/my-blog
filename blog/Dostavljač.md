---
title: (COCI 2017/2018 7) Dostavljač
date: 2026-9-3
tags: [树形DP,树形背包,COCI,题解,提高]
---
{/* truncate */}
## 题解
### 题意
有一棵包含 **N** 个节点的树，节点编号为 **1** 到 **N**，边权均为 1（移动一个单位时间）。Krešo 从节点 **1** 出发。

在每个单位时间内，他可以执行以下两种操作之一：
1. 移动到相邻节点（耗时 1 单位时间）
2. 在当前节点进行送货（耗时 1 单位时间），获得该节点所需的辣椒数量 **Aᵢ**（每个节点只能送货一次）

他总共有 **M** 个单位时间，之后停止。求他在这 **M** 时间内能够获得的最大辣椒总数。

**数据范围**

- **1 ≤ N, M ≤ 500**
- **1 ≤ Aᵢ ≤ 10⁶**
- 树以 **N-1** 条边给出

### 解法
看起来就是一个树形背包。

实际上是一个比较模板的树形背包问题。

状态很好设计$f_{i,j}$表示从节点$i$出发,耗时$j$单位时间能获得最多的辣椒数。

但是我们发现这个人可以进行折返走重复路径。

这样的问题我们也不是第一次遇到了，方法就是在状态中增加一维$0/1$,其中$0$表示从这个节点出发后没有回来，$1$表示从这个节点出发后已经回来了。

那么转移如下

$$
f_{x,j,0}=\max_{0 \leq k \leq m,y \in son_x}(f_{x,j-k-1,1}+f_{y,k,0},f_{x,j-k-2,0}+f_{y,k,1})\\
f_{x,j,1}=\max_{0 \leq k \leq m,y \in son_x}(f_{x,j-k-2,1}+f_{y,k,1})
$$

注意，这里的由于可以折返跑，所以时间是可以大于节点数的，即无法使用$siz$优化

时间复杂度为$O(nm^2)$

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e3+10;
int n,m;
int a[N];
int head[N],ver[2*N],nxt[2*N],tot;
void add(int x,int y)
{
    ver[++tot]=y;
    nxt[tot]=head[x];
    head[x]=tot;
}
int f[N][N][2];
void dfs(int x,int fa)
{
    for(int i=head[x];i;i=nxt[i])
    {
        int y=ver[i];
        if(y==fa) continue;
        dfs(y,x);
        for(int j=m;j>=0;j--)
        {
            for(int k=0;k<=m;k++)
            {
                if(j-k-1>=0) f[x][j][0]=max(f[x][j][0],f[x][j-k-1][1]+f[y][k][0]);
                if(j-k-2>=0)
                {
                    f[x][j][0]=max(f[x][j][0],f[x][j-k-2][0]+f[y][k][1]);
                    f[x][j][1]=max(f[x][j][1],f[x][j-k-2][1]+f[y][k][1]);
                }
            }
        }
    }
    for(int i=m;i>=1;i--)
    {
        f[x][i][0]=max(f[x][i][0],f[x][i-1][0]+a[x]);
        f[x][i][1]=max(f[x][i][1],f[x][i-1][1]+a[x]);
    }
}
int main()
{
    // freopen("1.in","r",stdin);
    // freopen("1.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>m;
    for(int i=1;i<=n;i++) cin>>a[i];
    for(int i=1;i<n;i++)
    {
        int x,y;
        cin>>x>>y;
        add(x,y);
        add(y,x);
    }
    dfs(1,0);
    cout<<max(f[1][m][0],f[1][m][1]);
    return 0;
}
```
</details>