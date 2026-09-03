---
title: (COCI 2017/2018 7) Go
date: 2026-9-3
tags: [动态规划DP,区间DP,COCI,题解,提高]
---
{/* truncate */}
## 题解
### 题意
有一条长度为 **N** 的街道，房子从左到右编号为 **1** 到 **N**。

有 **M** 只小精灵，第 **i** 只位于房子 **Aᵢ**，价值 **Bᵢ** 颗糖果，且必须在 **Tᵢ** 秒内被抓住（从比赛开始计时，到第 **Tᵢ** 秒结束前抓住都算），否则消失。每只小精灵位于不同的房子，且 **Aᵢ** 严格递增给出。

Branimirko 从第 **1** 秒开始位于房子 **K**。每一秒他可以：
- 向左或向右移动到相邻房子（耗时 1 秒），或
- 停留在原地（耗时 1 秒）。

当他在某一秒**结束**时与某只小精灵位于同一房子，且该小精灵尚未消失，则抓住它并获得其糖果。

求他能获得的最大糖果总数。

**数据范围**

- **1 ≤ K ≤ N ≤ 10³**
- **1 ≤ M ≤ 100**
- **1 ≤ Aᵢ ≤ N**，严格递增
- **1 ≤ Bᵢ ≤ 100**
- **1 ≤ Tᵢ ≤ 2000**
- 对于 20% 的数据：**M ≤ 10**
- 另外 20% 的数据：**M ≤ 20**

### 解法

很明显能看出来需要动态规划。

但是问题在于如何设计状态和转移。

这个题有一个很大的迷惑点在于$N \leq 1000,T \leq 2000$
于是有一个看起来很显然的状态就被设计出来了$f_{i,j}$表示当前在门牌号$i$，时间为$j$得到的最大糖果数。

但是这样设计转移就会出问题。

比如如何保证某个位置的糖果只取一次？

如果继续沿着这方面细想就会走上歧路，或者得出非常麻烦的做法。

这个时候我们就要换一个方向思考，我们发现我们在没有小精灵的房子进行折返一定是不优的，这只会白白浪费时间，所以我们的移动一定是从某个小精灵的房子(或起点)径直走向另一个有小精灵的房子。而题目保证了$a_i$单增，我们不需要排序就能轻松求出有小精灵的房子之间的距离。

然后我们发现，无论我们如何往返，我们一定是在一个区间内行走。并且最后我们一定在这个区间的一个端点上。那么我们可以设计状态$f_{l,r,t,p}$表示在$[l,r]$这个区间上，已经过了$t$秒，p为$0/1$表示当前在左/右端点上。

转移时要注意当前是否超时，超时了不会增加权值，但也有可能比别的方案更优，仍需把状态转移过来。

转移是麻烦而显然的，详细可以看代码。时间复杂度为$O(M^2T)$

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=1e2+10;
const ll inf=1e18;
int n,k,m;
ll f[N][N][2020][2];
ll b[N],a[N],t[N];
int s;
int main()
{
    // freopen("go.in.1","r",stdin);
    // freopen("4.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>k>>m;
    bool flag=false,flag2=false;
    for(int i=1;i<=m;i++)
    {   
        if(!flag)
        {
            cin>>b[i]>>a[i]>>t[i];
            if(b[i]==k) flag2=true,s=i;
            if(b[i]>k&&(!flag2))
            {
                flag=true;
                b[i+1]=b[i];
                a[i+1]=a[i];
                t[i+1]=t[i];
                b[i]=k;
                a[i]=0;
                t[i]=0;
                s=i;
            }
        } 
        else cin>>b[i+1]>>a[i+1]>>t[i+1];
    }
    if(!flag&&!flag2) b[++m]=k,s=m;
    if(flag) m++;
    // for(int i=1;i<=m;i++) cout<<b[i]<<' ';
    memset(f,0xcf,sizeof f);
    f[s][s][0][0]=f[s][s][0][1]=a[s];
    ll ans=0;
    for(int len=1;len<=m;len++)
    {
        for(int l=1;l+len-1<=m;l++)
        {
            int r=l+len-1;
            for(int T=0;T<=2000;T++)
            {
                if(T-(b[l+1]-b[l])>=0) f[l][r][T][0]=max(f[l][r][T][0],f[l+1][r][T-(b[l+1]-b[l])][0]+(T<t[l])*a[l]);
                if(T-(b[r]-b[l])>=0) f[l][r][T][0]=max(f[l][r][T][0],f[l+1][r][T-(b[r]-b[l])][1]+(T<t[l])*a[l]);
                if(T-(b[r]-b[r-1])>=0) f[l][r][T][1]=max(f[l][r][T][1],f[l][r-1][T-(b[r]-b[r-1])][1]+(T<t[r])*a[r]);
                if(T-(b[r]-b[l])>=0) f[l][r][T][1]=max(f[l][r][T][1],f[l][r-1][T-(b[r]-b[l])][0]+(T<t[r])*a[r]);
                ans=max(ans,f[l][r][T][0]);
                ans=max(ans,f[l][r][T][1]);
            }
        }
    }    
    cout<<ans;
    return 0;
}
```
</details>