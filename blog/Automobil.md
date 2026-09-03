---
title: (COCI 2017/2018 4) Automobil
date: 2026-9-3
tags: [COCI,题解,提高]
---
{/* truncate */}
## 题解
### 题意
有一个 **N** 行 **M** 列的矩阵，初始时第 **i** 行第 **j** 列的值为 **(i-1)M + j**（即按行优先从 1 到 **NM** 连续编号）。

接下来进行 **K** 次操作，每次操作为以下两种之一：
- **R X Y**：将第 **X** 行的所有元素乘以 **Y**
- **S X Y**：将第 **X** 列的所有元素乘以 **Y**

其中 **Y** 可以为 **0**。

所有操作按顺序执行。求最终矩阵所有元素之和对 **10⁹ + 7** 取模的结果。

**数据范围**

- **1 ≤ N, M ≤ 10⁶**
- **1 ≤ K ≤ 10³**
- **1 ≤ X ≤ N**（对于 R 操作）
- **1 ≤ X ≤ M**（对于 S 操作）
- **0 ≤ Y ≤ 10⁹**
- 对于 50% 的数据：**1 ≤ N, M ≤ 10³**

### 解法
此题其实十分简单，不知道为什么评提高~~那你为什么考场上55分~~

这道题有很多做法，这里只将我知道的两种。

首先第一种是我的考场做法，我们观察数据范围，很容易发现$K$很小$N$和$M$很大，于是我们考虑现预处理出总的总和，每一排，每一列的总和，然后对答案进行调整。

首先还有一个要注意的是要将同排或者同列的操作进行合并，不然会出现问题。

对于一排的操作，我们现将这一排的总和乘上$Y$然后在枚举每一种列操作，单独计算交点产生的额外贡献。

对于一列的操作，由于我们之前已经计算过交点产生的贡献，所以计算是枚举每一种排操作去掉交点的贡献。

第二种做法是$AI$做的，我认为这种做法十分优美，于是也在这里讲一下。

观察题意我们把行，列操作合并，记录$R_i$表示第$i$行的总乘积，$S_i$表示第$i$列的总乘积。

那么我们题目要球的就是这样一个式子

$$ 
\sum_{i=1}^{n}\sum_{j=1}^{m}((i-1)*m+j) \cdot R_i \cdot S_j 
$$

直接求这个式子是$O(nm)$的但是我们可以转换一下。

$$ 
\begin{aligned}
ans &= \sum_{i=1}^{n}\sum_{j=1}^{m}((i-1)*m+j) \cdot R_i \cdot S_j \\
&= \sum_{i=1}^{n} \cdot R_i\sum_{j=1}^{m}((i-1)*m+j) \cdot S_j \\
&= \sum_{i=1}^{n} \cdot R_i\sum_{j=1}^{m}((i-1)*m\cdot S_j+j\cdot S_j)  \\
&= \sum_{i=1}^{n} \cdot R_i((i-1)*m\cdot \sum_{j=1}^{m}S_j+\sum_{j=1}^{m}j\cdot S_j)  \\
\end{aligned}
$$

然后我们发现这个式子可以$O(n)$解决

### 代码
<details>
<summary>code1</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=1e6+10;
const ll mod=1e9+7;
ll n,m,k;
struct node{
    ll x,y;
}qr[N],qs[N];
ll totr,tots;
ll visr[N],viss[N];
ll sumr[N],sums[N];
ll ans;
ll inv2;
int main()
{
    // freopen("automobil2.in","r",stdin);
    // freopen("1.out","w",stdout);
    inv2=((-1ll*mod/2ll)%mod+mod)%mod;
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>m>>k;
    sumr[1]=((m+1ll)*m%mod*inv2)%mod;
    for(int i=2;i<=n;i++) sumr[i]=(sumr[i-1]+m*m%mod)%mod;
    sums[1]=((n-1ll)*m+2ll)%mod*n%mod*inv2%mod;
    ans=(ans+sums[1])%mod;
    for(int i=2;i<=m;i++) sums[i]=(sums[i-1]+n)%mod,ans=(ans+sums[i])%mod;
    for(int i=1;i<=k;i++)
    {
        char c;
        cin>>c; 
        int x,y;
        cin>>x>>y;
        if(c=='R')
        {
            if(visr[x]) qr[visr[x]].y=qr[visr[x]].y*y%mod;
            else
            {
                visr[x]=++totr;
                qr[totr].x=x;
                qr[totr].y=y;
            }
        } 
        else 
        {
            if(viss[x]) qs[viss[x]].y=qs[viss[x]].y*y%mod;
            else
            {
                viss[x]=++tots;
                qs[tots].x=x;
                qs[tots].y=y;
            }
        }
    }
    // for(int i=1;i<=totr;i++) cout<<"R"<<qr[i].x<<' '<<qr[i].y<<'\n';
    // for(int i=1;i<=tots;i++) cout<<"L"<<qs[i].x<<' '<<qs[i].y<<'\n';
    // cout<<ans<<' ';
    for(int i=1;i<=totr;i++)
    {
        ans=((ans-sumr[qr[i].x])%mod+mod)%mod;
        ll now=(sumr[qr[i].x]*qr[i].y)%mod;
        // cout<<now<<' ';
        for(int j=1;j<=tots;j++)
        {
            now=(now+((qr[i].x-1ll)*m%mod+qs[j].x)*qr[i].y%mod*((qs[j].y-1ll)%mod+mod)%mod)%mod;
        }
        // cout<<now<<'\n';
        ans=(ans+now)%mod;
    }
    for(int i=1;i<=tots;i++)
    {
        ll now=sums[qs[i].x]*((qs[i].y-1ll)%mod+mod)%mod;
        // cout<<now<<' ';
        for(int j=1;j<=totr;j++)
        {
            now=((now-((qr[j].x-1ll)*m%mod+qs[i].x)*((qs[i].y-1ll)%mod+mod)%mod)%mod+mod)%mod;
        }
        // cout<<now<<'\n';
        ans=(ans+now)%mod;
    }
    cout<<ans;
    return 0;
}
```
</details>

<details>
<summary>code2</summary>
```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const ll MOD = 1000000007LL;
const int N = 1000005;

ll n, m, k;
ll rowMul[N], colMul[N];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n >> m >> k;
    for (int i = 1; i <= n; ++i) rowMul[i] = 1;
    for (int i = 1; i <= m; ++i) colMul[i] = 1;

    for (int i = 0; i < k; ++i) {
        char c;
        int x;
        ll y;
        cin >> c >> x >> y;
        if (c == 'R') rowMul[x] = rowMul[x] * y % MOD;
        else colMul[x] = colMul[x] * y % MOD;
    }

    ll sumCol = 0, sumColWeighted = 0;
    for (int j = 1; j <= m; ++j) {
        sumCol = (sumCol + colMul[j]) % MOD;
        sumColWeighted = (sumColWeighted + colMul[j] * j) % MOD;
    }

    ll ans = 0;
    for (int i = 1; i <= n; ++i) {
        ll cur = rowMul[i] % MOD;
        ll base = ((i - 1) * m % MOD) * sumCol % MOD;
        base = (base + sumColWeighted) % MOD;
        ans = (ans + cur * base) % MOD;
    }

    cout << ans % MOD << '\n';
    return 0;
}

```
</details>