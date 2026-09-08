---
title: (COCI 2015/2016 6) PAROVI
date: 2026-9-7
tags: [动态规划DP,COCI,题解,普及+/提高-]
---
{/* truncate */}
## 题解
### 题意
给定正整数 **N**（1 ≤ N ≤ 20）。  
考虑所有满足 **1 ≤ a < b ≤ N** 且 **gcd(a, b) = 1** 的数对。  
Mirko 可以从中选择**任意非空**的子集（即至少选一个数对）。

之后 Slavko 尝试找到一个整数 **x**，满足 **2 ≤ x ≤ N**，并且对于 Mirko 所选子集中的**每一个**数对 **(a, b)**，都必须满足以下两个条件之一：
- 两个数都 **小于** x；
- 两个数都 **大于等于** x。

如果不存在这样的 **x**，则 Mirko 获胜。

求 Mirko 所有不同的选择方案总数，答案对 **10⁹** 取模后输出。

**数据范围**  
- **1 ≤ N ≤ 20**

### 解法

~~三条区在机房里2小时每一个人写出来的~~$dp$题

此题似乎还有一种[容斥做法](https://kianaisthecutest.nsoj.top/blog-posts/%E9%A2%98%E8%A7%A3/COCI/2015-2016-C/B-PAROVI)这里讲时间复杂度更优的$dp$做法。

观察题意，我们发现我们似乎可以把每个互质数对看作一条$(l,r)$的线段。那么题目就是要求选择一些线段将$(1,n)$这个区间覆盖的方案数。

由此我们可以设计状态$f_{i,j}$表示对于前$i$个线段，覆盖$(1,j)$这个区间的方案数。

然后考虑如何转移，首先我们要把所有线段按照右端点从小到大排序，但实际上我们只需要枚举右端点，然后暴力找左端点就行了。

然后对于当前枚举的线段，枚举$j$，首先如果不选择当前线段
$$
f_{i,j}=f_{i-1,j}
$$
如果选择，那么就有几种情况

$1.j<l$ 此时说明这条线段与之前覆盖的区间没有交集，也就是说如果选择了这条线段依然只能覆盖$(1,j)$所以
$$
f_{i,j}+=f_{i-1,j}
$$
$2.l\leq j < r$说明这条线段与之前有交集，那么覆盖的区间就变为了$(1,r)$对于这些$j$来说一定不能选择。

$3.j\geq r$首先$j$只需要枚举到$=r$即可，因为我们按照右端点排了序，在这条线段被枚举到之前一定不存在更大的$r$，对于$j=r$
$$
f_{i,r}+=\sum_{k=l}^{r} f_{i-1,k}
$$
这个求和枚举的时候记录就可以了，没必要单独循环。

由于无法取数字$1$可以理解为初始空方案$1$被覆盖了。

那么这道题就做完了。时间复杂度$O(n^2)$
### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=1e3+10;
const ll mod=1e9;
int n;
ll f[N][N];
int tot;
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n;
    f[0][1]=1;
    for(int r=2;r<=n;r++)
    {
        for(int l=1;l<r;l++)
        {
            if(__gcd(l,r)==1) 
            {
                tot++;
                ll ans=0;
                for(int j=1;j<=r;j++)
                {
                    f[tot][j]=(f[tot][j]+f[tot-1][j])%mod;
                    if(j<l) f[tot][j]=(f[tot][j]+f[tot-1][j])%mod;
                    else if(j<r) ans=(ans+f[tot-1][j])%mod;
                    else if(j==r) f[tot][j]=((f[tot][j]+ans)%mod+f[tot-1][j])%mod;
                }
            }
        }
    }
    cout<<f[tot][n];
    return 0;
}
```

</details>



