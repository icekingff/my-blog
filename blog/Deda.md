---
title: (COCI 2017/2018 1) Deda
date: 2026-8-30
tags: [线段树,题解,COCI,提高]
---
{/* truncate */}
## 题解
### 题意

有 **N** 个孩子，年龄分别为 **1** 到 **N**。火车沿途有编号为 **0, 1, 2, …** 的车站。

动态依次处理 **Q** 条语句：

- **M X A**：表示“在第 **X** 站，年龄为 **A** 的孩子下车了”，记录下这条信息。
- **D Y B**：询问“在已经记录的下车信息中，年龄 **≥ B** 且下车车站编号 **≤ Y** 的孩子里，年龄最小的是多少”。若不存在这样的孩子，回答 **-1**。

注意：信息只会不断增加，不会删除。每次询问只基于当前已记录的信息。

**数据范围**

- **2 ≤ N, Q ≤ 2 × 10^5**
- **1 ≤ X, Y ≤ 10^9**
- **1 ≤ A, B ≤ N**
- 输入保证至少有一个 **D** 询问
### 解法

一秒看出来是个数据结构题，~~这不是废话？~~

整理这道题的信息。

车站的编号，孩子的年龄......操作的时间？

我们要维护一个数据结构，而这个数据结构的下标，取值，限制，这几个维度如何分配呢？

若我们以车站的编号作为下标，孩子的年龄作为权值，那么我们查询时,车站编号$\leq Y$这个限制很好满足，但是我们要求年龄$\geq B$ 的最小年龄，就难以维护。

所以一般这种同时在限制和答案中出现的信息，我们需要把这个信息放在线段树下标上维护。这种线段树也常被成为权值线段树（不过我认为这种说法并不贴切，这本质上只是一种信息维度的转换而已，与"权值"无关）

于是这道题就变得简单起来了，我们把孩子的年龄作为线段树的下标，车站的编号作为线段树的权值。很容易想到查询时在线段树上二分，找到$(B,N)$这个区间内最靠左的满足车站编号$\leq Y$的节点，就是答案。

因此我们在线段树维护区间最小值，每次单点修改也取最小的那个(因为原来那个孩子不会消失)。

那么这道题就做完了

至于我一开始说的，"操作的时间"这个维度也可能会作为信息的维度进行转换，具体的例子可以去看**P7424 天天爱射击**这道题。(不过本题用不上就是了)

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=2e5+10;
const int inf=1e9+10;
int n,m;
struct NODE{
    int opt,x,a;
}q[N];
struct node{
    int mn;
}tree[4*N];
inline void pushup(int x){tree[x].mn=min(tree[x*2].mn,tree[x*2+1].mn);}
inline void build(int x,int l,int r)
{
    // cout<<l<<' '<<r<<' '<<x<<'\n';
    if(l==r)
    {
        tree[x].mn=inf;
        return ;
    }
    int mid=(l+r)>>1;
    build(x*2,l,mid);
    build(x*2+1,mid+1,r);
    pushup(x);
    return ;
}
inline void add(int p,int x,int l,int r,int k)
{
    if(l==r) 
    {
        tree[x].mn=min(tree[x].mn,k);
        return ;
    }
    int mid=(l+r)>>1;
    if(p<=mid) add(p,x*2,l,mid,k);
    else add(p,x*2+1,mid+1,r,k);
    pushup(x);
    return ;
}
inline int ask(int L,int R,int x,int l,int r,int k)
{
    if(l>=L&&r<=R)
    {
        if(l==r)
        {
            if(tree[x].mn>k) return n+1;
            return l;
        }
        if(tree[x].mn>k) return n+1;
        int mid=(l+r)>>1;
        if(tree[x*2].mn<=k) return ask(L,R,x*2,l,mid,k);
        else return ask(L,R,x*2+1,mid+1,r,k);
    }
    int mid=(l+r)>>1;
    int ans;
    if(L<=mid) 
    {
        ans=ask(L,R,x*2,l,mid,k);
        if(ans!=n+1) return ans;
    }
    if(R>mid)
    {
        ans=ask(L,R,x*2+1,mid+1,r,k);
    }
    return ans;
}
int main()
{
    // freopen("1.in","r",stdin);
    // freopen("1.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>m;
    for(int i=1;i<=m;i++)
    {
        char opt;
        cin>>opt>>q[i].x>>q[i].a;
        if(opt=='M') q[i].opt=1;
        else q[i].opt=0;
    }
    build(1,1,n);
    for(int i=1;i<=m;i++)
    {
        if(q[i].opt)
        {
            add(q[i].a,1,1,n,q[i].x);
        }
        else
        {
            int ans=ask(q[i].a,n,1,1,n,q[i].x);
            if(ans>n) cout<<-1<<'\n';
            else cout<<ans<<'\n';
        }
    }
    return 0;
}
```

</details>

### 废话
气死我了，考场上明明$1$小时写出来了，某个不知名人士告诉我此题并不简单恐要用上主席树,于是我非常不理智的在还没过样例的情况下选择了重写。