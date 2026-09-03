---
title: (COCI 2017/2018 5) Pictionary
date: 2026-9-3
tags: [并查集,Kruskal重构树,LCA,COCI,题解,提高]
---
{/* truncate */}
## 题解
### 题意
有 **n** 个城市，编号为 **1** 到 **n**，初始时两两不连通。

修路工程持续 **m** 天，第 **i** 天（**1 ≤ i ≤ m**）会在所有满足 **gcd(a, b) = m - i + 1** 的城市对 **(a, b)** 之间修建一条无向边。

有 **q** 次询问，每次询问给定两个城市 **a, b**，求它们最早在第几天变得连通（即存在一条路径由该天及之前修建的边组成）。如果到第 **m** 天仍未连通，则输出 **m**（题目未明确说明，但根据题意第 **m** 天是最后一天）。

**数据范围**

- **1 ≤ n, q ≤ 10⁵**
- **1 ≤ m ≤ n**
- 对于 40% 的数据：**n ≤ 4000，q ≤ 10⁵**

### 解法
看到这个陌生的标签，就知道这道题用了一个从未用过的神秘做法。

首先我们发现这道题第一个难点在于如何连边。

题目给出的连边方法是对于所有以$m-i+1$为$gcd$的点对进行连边，但是我们发现一个性质，$m-i+1$一定也是这$n$个点之一，而这个点与他所有的$<n$的倍数的$gcd$一定是$m-i+1$那么也就是说$m-i+1$这个的点一定会向所有他$<n$的倍数所对应的点连边，那么这些点一定就相互连通了，而其他的$gcd$为$m-i+1$的点对一定也被包含在里面，因为他们也一定是$m-i+1$的倍数。而此题我们只关心这些点的连通性，所以这些内部边无需处理。

所以我们连边的问题就解决了，考虑使用并查集维护连通性，这道题就做完了......吗？

我们观察询问，发现询问要求我们得知两个点首次连通的时间。

此时就要我们搬出重构树这个东西了，我们考虑把初始的节点看作树的叶子，在每次合并并查集的时候创造一个新的节点，作为这两个并查集所对应节点的父亲，并把合并时间赋给这个节点作为权值，最终我们一定会得到一颗树。而我们要知道两个节点合并的时间就是树上$LCA$的权值。这个正确性是很显然的，这里就不做证明。

然后我们就发现这道题真的做完了，时间复杂度为$O(n \log n +q)$(枚举倍数是$\log n$的，$dfn$序求$LCA$的$n \log n$预处理，$O(1)$查询)

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=2e5+10;
int n,m,q;
int fa[N],siz[N];
inline int get(int x)
{
    if(fa[x]==x) return x;
    return fa[x]=get(fa[x]);
}
int head[N],ver[2*N],nxt[2*N],tot;
void add(int x,int y)
{
    ver[++tot]=y;
    nxt[tot]=head[x];
    head[x]=tot;
    return ;
}
int id[N],tott,v[N];
int dfn[N],k;
int st[30][N];
void dfs(int x,int fa)
{
    dfn[x]=++k;
    st[0][dfn[x]]=fa;
    for(int i=head[x];i;i=nxt[i])
    {
        int y=ver[i];
        dfs(y,x);
    }
}
inline int maxx(int x,int y){return dfn[x]<dfn[y]?x:y;}
void solvest()
{
    for(int i=1;i<=__lg(tott);i++)
    {
        for(int j=1;j+(1<<i)-1<=tott;j++)
        {
            st[i][j]=maxx(st[i-1][j],st[i-1][j+(1<<(i-1))]);
        }
    }
}
int lca(int x,int y)
{
    if(x==y) return x;
    if(dfn[x]>dfn[y]) swap(x,y);
    int len=__lg(dfn[y]-dfn[x]);
    return maxx(st[len][dfn[x]+1],st[len][dfn[y]-(1<<len)+1]);
}
int main()
{
    // freopen("4.in","r",stdin);
    // freopen("4.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>m>>q;
    for(int i=1;i<=n;i++) fa[i]=i,siz[i]=1,id[i]=++tott;
    for(int i=1;i<=m;i++)
    {
        for(int j=2;j*(m-i+1)<=n;j++)
        {
            int fx=get(m-i+1),fy=get(j*(m-i+1));
            if(fx==fy) continue;
            if(siz[fy]<siz[fx]) swap(fx,fy);
            if(siz[fx]==siz[fy]) siz[fy]++;
            fa[fx]=fy;
            tott++;
            add(tott,id[fx]);
            add(tott,id[fy]);
            v[tott]=i;
            id[fy]=tott;
        }
    }
    dfs(tott,0);
    solvest();
    // for(int i=1;i<=tott;i++) cout<<v[i]<<' ';
    for(int i=1;i<=q;i++)
    {
        int x,y;
        cin>>x>>y;
        // cout<<lca(x,y)<<' ';
        cout<<v[lca(x,y)]<<'\n';
    }
    return 0;
}
```
</details>