---
title: (CF 1922F) Replace on Segment
date: 2026-10-21
tags: [动态规划DP,题解,Codeforces,省选/NOI-,区间DP,对偶优化]
---
{/* truncate */}
## 题解

### 题意

给定长度为 **n** 的数组 **a₁, a₂, …, aₙ**，其中每个元素均为 **1 到 x** 之间的整数。

允许进行任意次如下操作：

- 选择三个整数 **l, r, k**，满足 **1 ≤ l ≤ r ≤ n**、**1 ≤ k ≤ x**，并且对于所有 **l ≤ i ≤ r**，都有 **aᵢ ≠ k**。
- 然后将区间 **[l, r]** 内的所有元素都替换为 **k**。

也就是说，每次可以选择一个子区间，并选择一个**在该子区间中未出现过**的整数 **k**（**1 ≤ k ≤ x**），将整个子区间替换为 **k**。

目标是使数组中所有元素相等。求所需的最少操作次数。

**数据范围**

- **1 ≤ t ≤ 100**
- **1 ≤ x ≤ n ≤ 100**
- **1 ≤ aᵢ ≤ x**
- 所有测试用例中 **n** 的总和不超过 **500**
### 解法

这是一道看起来并不难的区间DP

首先根据题意，我们可以观察出操作的一些性质。

- $1.$这些操作一定不交，因为假设存在一组相交的区间，我们完全可以把它变成两个等价的不交的区间操作。

- $2.$这些操作的次数一定$\leq \frac{n}{x}$ 。这个想到要难一些，首先，其实容易发现，我们只需要找到$[1,x]$中出现次数$cnt$最少的数$k$，然后将序列按照每个等于$k$的位置分段，就可以在$cnt+1$的操作次数下完成目标。而根据抽屉原理，$cnt$最大是$\frac{n}{x}$的。

首先根据性质$1.$我们很容易想到区间DP，这样我们的操作就变成了一个树形结构，由小区间推大区间。

那么我们考虑设计转移方程，首先我们区间DP，那状态中就一定有$l,r$。考虑还有什么具有后效性的信息，我们发现我们操作时，需要知道这个区间中是否存在$k$。那么很符合直觉的一个状态设计就是。

设$f_{l,r,k}$表示，将$[l,r]$区间内的所有数变成$k$的最小操作次数。然而我们发现我们转移的时候需要知道这个区间中是否出现过$k$，那么我们可以建立一个辅助DP数组$g_{l,r,k}$表示将$[l,r]$区间内所有数都变成不是$k$的数的最小操作次数。

于是我们开始考虑转移方程。

首先对于大区间，我们可以把它切成两个小区间，只要两个小区间满足条件，那么这个大区间就满足条件，第一个转移方程就列出来了

$$
f_{l,r,k}=\min_{l \leq p < r} f_{l,p,k}+f_{p+1,r,k}
$$

$g$数组同理。

可是这样真的就行了吗？

手模几个样例就会发现，除了把两个小区间都变成$k$以外，我们还可以把整个大区间变成$\neq k$再通过一次操作把整个区间变成$k$

那么对于$g$数组，我们可以通过一次操作，把整个区间变成一个都为$l$的区间，其中$l \neq k$

那么第二个式子是长这样的。

$$
f_{l,r,k}=g_{l,r,k} +1
$$

$$
g_{l,r,k}=\min_{1 \leq s \leq x,s \neq k}g_{l,r,s}+1
$$

那么这道题就做完了，$O(n^4)$勉强能过。

但是老师老师，你的标签里还有个**对偶优化**是什么意思啊？

没错，这道题还有更优的做法。

还记得我们的**性质2**吗？我们的操作次数是一个比$n$小的量级。

**当我们发现我们方程的值域的量级比某个状态要小的时候，且这个状态满足单调性，那么我们就可以考虑使用对偶优化**

那么我们状态中是什么满足单调性呢？

由于我们的目标是覆盖整个$[1,n]$区间，所以右端点$r$是具有单调性的,也就是说，在左端点固定的情况下我们希望右端点越大越好。

那么我们的状态就改成$f_{i,j,k}$ 表示以$i$为右端点，操作次数至多为$j$,把区间变成全为$k$的最大右端点。

那么我们的转移就变成了类似背包的转移了。

$$
f_{i,j,k}=\max_{0 \leq c \leq j} f_{f_{i,c,k}+1,j-c,k}
$$

第二种就是

$$
f_{i,j,k}=g_{i,j-1,k}
$$

$$
g_{i,j,k}=\max_{1 \leq s \leq x,s \neq k}g_{i,j-1,s}
$$

还有注意，由于第一种转移会用到这个方程本身，我们优先进行第二种转移，并保证用到方程本身的那个转移是最后进行的。

还有我们的状态定义是**至多j次**所以每次要从$j-1$的式子继承答案。至于为什么这样做是为了方便保证我们转移的正确性，否则需要处理太多不合法状态

最后分析时间复杂度是$O(n \cdot \frac{n}{x} \cdot x \cdot \frac{n}{x})$即$O(\frac{n^3}{x})$的

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e2+10;
int T;
int n,m;
int f[N][N][N][2];
int a[N];
int t[N];
inline void solve()
{
    memset(t,0,sizeof t);
    memset(f,0,sizeof f);
    cin>>n>>m;
    for(int i=1;i<=n;i++)
    {
        cin>>a[i];
        t[a[i]]++;
    }
    int minn=n;
    for(int i=1;i<=m;i++) minn=min(minn,t[i]);
    minn++;
    for(int i=1;i<=n;i++)
    {
        for(int k=1;k<=m;k++)
        {
            if(a[i]==k) 
            {
                f[i][0][k][0]=i-1;
                for(int j=i;j<=n;j++)
                {
                    if(a[j]==k)
                    {
                        f[i][0][k][1]=j;
                    } 
                    else break;
                }
            }
            else
            {
                f[i][0][k][1]=i-1;
                for(int j=i;j<=n;j++)
                {
                    if(a[j]!=k)
                    {
                        f[i][0][k][0]=j;
                    } 
                    else break;
                }
            }
        }
    }
    for(int i=n;i>=1;i--)
    {
        int maxx=-1,lmaxx=-1;
        int maxid=a[i];
        for(int k=1;k<=m;k++)
        {
            if(f[i][0][k][0]>maxx)
            {
                lmaxx=maxx;
                maxx=f[i][0][k][0];
                maxid=k;
            }
            else 
            {
                lmaxx=max(lmaxx,f[i][0][k][0]);
            }
        }
        for(int j=1;j<=minn;j++)
        {
            for(int k=1;k<=m;k++)
            {
                f[i][j][k][0]=max(f[i][j][k][0],f[i][j-1][k][0]);
                f[i][j][k][1]=max(f[i][j][k][1],f[i][j-1][k][1]);
                if(k==maxid) f[i][j][k][0]=max(f[i][j][k][0],lmaxx);
                else f[i][j][k][0]=max(f[i][j][k][0],maxx);
                f[i][j][k][1]=max(f[i][j][k][1],f[i][j-1][k][0]);
                for(int cnt=0;cnt<=j;cnt++)
                {
                    f[i][j][k][0]=max(f[f[i][cnt][k][0]+1][j-cnt][k][0],f[i][j][k][0]);
                    f[i][j][k][1]=max(f[f[i][cnt][k][1]+1][j-cnt][k][1],f[i][j][k][1]);
                }
            }
            maxx=-1,lmaxx=-1;
            for(int k=1;k<=m;k++)
            {
                if(f[i][j][k][0]>maxx)
                {
                    lmaxx=maxx;
                    maxx=f[i][j][k][0];
                    maxid=k;
                }
                else 
                {
                    lmaxx=max(lmaxx,f[i][j][k][0]);
                }
            }
        }
    }
    // cout<<f[7][1][2][1];
    for(int j=0;j<=minn;j++) 
    {
        for(int k=1;k<=m;k++) 
        {
            // cout<<f[1][j][k][1]<<' ';
            if(f[1][j][k][1]==n)
            {
                cout<<j<<'\n';
                return ;
            }
        }
        // cout<<'\n';
    }
    // cout<<"?";
    return ;
}
int main()
{
    // freopen("3.in","r",stdin);
    // freopen("3.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>T;
    while(T--) solve();
    return 0;
}
```
</details>



