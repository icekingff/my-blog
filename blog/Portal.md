---
title: (COCI 2017/2018 3) Portal
date: 2026-8-30
tags: [最短路,题解,COCI,提高]
---
{/* truncate */}
## 题解
### 题意
给定一个 **N** 行 **M** 列的网格。格子类型包括：
- **#**：障碍物（墙）
- **C**：起点
- **F**：终点
- **.**：空地

四周保证为墙，且 **C** 和 **F** 各出现一次。

Chell 可以在网格上移动，每次移动（耗时 1 单位时间）可以选择：

1. **普通移动**：向上、下、左、右移动一格，不能走入墙。
2. **射击传送门**：向某个方向（上/下/左/右）射击，在碰到的第一面墙的该侧创建一个传送门。此操作耗时 **0**。
   - 同时最多存在 **2** 个传送门。
   - 若已有 2 个，再创建新门会使最早的那个消失。
   - 不能在已有传送门的位置再创建。
3. **传送**：若当前格子与某面墙相邻，且该墙面上有一个传送门，则可以进入该传送门，从另一个传送门出来（到达非障碍格子）。此操作耗时 **1**，且要求两个传送门同时存在。

求从 **C** 到达 **F** 所需的最少时间。若无法到达，输出 **"nemoguce"**。

**数据范围**

- **4 ≤ N, M ≤ 500**
- 对于 50% 的数据，**4 ≤ N, M ≤ 15**

### 解法

首先看到这个和数据范围很容易想到跑最短路。

那么我们的问题就是如何连边建图。

首先根据最基础的移动方式，每个格子对相邻的所有不是墙的格子连边。

接下来就是传送了，首先我们注意到我们不需要留传送门，因为我们开门是没有代价的。所以当前节点向哪个方向开传送门只与当前节点的位置有关。

我们知道开传送门只有上,下,左,右四个方向，穿梭的起点和终点也是这四个方向延伸出去最远的墙壁的距离。

而我们只需要走到距离最近的那个方向的墙，然后开启传送门就可以传送到原来任意方向的尽头。

那么每个点就再向四个方向尽头的点连边，权值就是最近墙的距离。

每个节点四个方向墙的距离都可以预处理出来。

最后跑一边$dij$或者$spfa$就行了

我的代码是$dij$

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=2e6+10;
int n,m;
int head[N],ver[N],edge[N],nxt[N],tot;
void add(int x,int y,int z)
{
    ver[++tot]=y;
    edge[tot]=z;
    nxt[tot]=head[x];
    head[x]=tot;
}
string str[520];
bool b[N],vis[N];
int s,t;
int a[N][4];
int d[N];
int main()
{
    // freopen("2.in","r",stdin);
    // freopen("2.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>m;
    for(int i=1;i<=n;i++)
    {
        cin>>str[i];
        for(int j=1;j<=m;j++)
        {   
            if(str[i][j-1]!='#') b[(i-1)*m+j]=true;
            if(str[i][j-1]=='C') s=(i-1)*m+j;
            if(str[i][j-1]=='F') t=(i-1)*m+j;
        }
    }
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=m;j++)
        {
            if(!b[(i-1)*m+j])
            {
                a[(i-1)*m+j][0]=a[(i-1)*m+j][1]=0;
                continue;
            } 
            if(b[i*m+j]) add((i-1)*m+j,i*m+j,1);
            a[(i-1)*m+j][1]=a[(i-2)*m+j][1];
            if(b[(i-2)*m+j]) add((i-1)*m+j,(i-2)*m+j,1),a[(i-1)*m+j][1]++;
            a[(i-1)*m+j][0]=a[(i-1)*m+j-1][0];
            if(b[(i-1)*m+j-1]) add((i-1)*m+j,(i-1)*m+j-1,1),a[(i-1)*m+j][0]++;
            if(b[(i-1)*m+j+1]) add((i-1)*m+j,(i-1)*m+j+1,1);
        }
    }
    for(int i=n;i>=1;i--)
    {
        for(int j=m;j>=1;j--)
        {
            if(!b[(i-1)*m+j])
            {
                a[(i-1)*m+j][2]=a[(i-1)*m+j][3]=0;
                continue;
            } 
            a[(i-1)*m+j][2]=a[(i-1)*m+j+1][2];
            if(b[(i-1)*m+j+1]) a[(i-1)*m+j][2]++;
            a[(i-1)*m+j][3]=a[i*m+j][3];
            if(b[i*m+j]) a[(i-1)*m+j][3]++;
        }
    }
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=m;j++)
        {
            if(!b[(i-1)*m+j]) continue;
            int ans=N;
            for(int k=0;k<4;k++) ans=min(a[(i-1)*m+j][k],ans);
            ans++;
            add((i-1)*m+j,(i-1)*m+j-a[(i-1)*m+j][0],ans);
            add((i-1)*m+j,(i-1)*m+j+a[(i-1)*m+j][2],ans);
            add((i-1)*m+j,(i-1-a[(i-1)*m+j][1])*m+j,ans);
            add((i-1)*m+j,(i-1+a[(i-1)*m+j][3])*m+j,ans);
        }
    }
    priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>> q;
    memset(d,0x3f,sizeof d);
    d[s]=0;
    q.push({d[s],s});
    while(q.size())
    {
        int x=q.top().second;
        q.pop();
        if(vis[x]) continue;
        vis[x]=true;
        for(int i=head[x];i;i=nxt[i])
        {
            int y=ver[i],z=edge[i];
            if(d[y]>d[x]+z)
            {
                d[y]=d[x]+z;
                q.push({d[y],y});
            }
        }
    }
    if(d[t]==0x3f3f3f3f) cout<<"nemoguce\n";
    else cout<<d[t];
    return 0;
}

```
</details>