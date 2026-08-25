---
title: (COCI 2023/2024 5) Rolete
date: 2026-8-25
tags: [贪心, 题解, COCI]
---
{/* truncate */}
## 题解
### 题意
给定一个长度为$n$序列。存在以下两种操作

$1.$选择序列中的一个值减$1$代价为$t$

$2.$将所有值减$1$代价为$s+k \cdot r$,其中$r$表示序列中$\leq 0$的数的个数

给定$q$次询问，每次询问给定一个$h$，求使序列中任意值$\leq h$的最小代价

范围
$1 \leq n,s,q,h \leq 10^5,0 \leq k \leq 10^5$
### 解法
考虑一种贪心

从高到低枚举$h$,比较将所有大于$h$的值执行操作$1$的代价与使用一次操作$2$的代价。

然后就能转换成$h+1$的情况继承上一次的答案相加即可

考虑证明这样做的正确性,据说有严谨的数学证明方式，可是我不会，于是考虑使用感性的反证法。

如果我们继承$h+1$的最优解，而在$h$时操作得不到最优解，当且仅当之前的某次操作会让代价变大，而让本次代价变小。

$1.$假设我们过去使用操作$1$会使代价增大，而会让本次操作$2$由于$\leq 0$的数变少导致代价变小。但是我们过去使用的原本的操作$2$的代价一定$\leq $现在使用操作$2$的代价，而如果原本使用操作$2$后续使用操作$1$的代价一定$\leq $使用操作$1$后后续使用操作$1$的代价所以说原本使用操作$2$一定不劣。

$2.$假设我们过去使用操$2$会使代价增大，而会让本次操作$1$由于一些原本不用降的数被提前降了导致代价变小。但是我们过去使用操作1的代价一定$\leq$本次使用操作$1$的代价，而过去使用操作$2$的代价由于使用了操作$1$，后续使用操作$2$的代价一定$\leq$本次使用操作$2$的代价。

证毕

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=1e5+10;
int n;
ll t,s,k;
int a[N];
int q;
ll ans[N];
ll flag,pre[N],nxt[N];
int main()
{
    // freopen("3.in","r",stdin);
    // freopen("3.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>t>>s>>k;
    for(int i=1;i<=n;i++)
    {
        int x;
        cin>>x;
        pre[x]++;
        nxt[x]++;
    }
    for(int i=0;i<N;i++) pre[i]+=pre[i-1];
    for(int i=N-2;i>=0;i--) nxt[i]+=nxt[i+1];
    for(int i=N-2;i>=0;i--)
    {
        ll ans1=nxt[i+1+flag]*t,ans2=pre[flag]*k+s;
        if(ans1<ans2) ans[i]=ans[i+1]+ans1;
        else ans[i]=ans[i+1]+ans2,flag++;
    }
    cin>>q;
    for(int i=1;i<=q;i++)
    {
        ll h;
        cin>>h;
        cout<<ans[h]<<' ';
    }
    return 0;
}
```
</details>