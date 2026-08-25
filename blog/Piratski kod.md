---
title: (COCI 2023/2024 5) Piratski kod
date: 2026-8-25
tags: [动态规划DP,组合数学,题解,COCI]
---
{/* truncate */}
## 题解
### 题意
给定一个长度$n$，分别求每一个长度为$k(k \leq n)$的所有可能的二进制序列的权值总和。

定义一个二进制串的权值

将二进制串分为若干个子串满足：
对于除了末尾外的子串，每个子串以一对连续$1$结尾且仅含有一对连续$1$。

定义长度为$k$的子串$s$的权值为
$$\sum_{i=1}^{k-1} s_i \cdot fib_{i+1}$$
<details>
<summary>$fib$定义</summary>

$fib_1=1,fib_2=1,fib_i=fib_{i-1}+fib_{i-2}(i > 2)$
</details>
那么该二进制串的权值为，分割后含连续$1$的子串的权值和

范围：$n \leq 5000$
### 解法
考虑$dp$

难点在于设计状态。

首先我们观察到我们子串的权值由两部分组成：
含连续$1$的串(以下称：整块)，不含连续$1$的串(以下称：散块)

而每一个二进制串的权值由一个整块和一个散块组成。

于是我们可以设计状态$f_i$表示长度为$i$的整块的权值总和。$g_{i,1/0}$表示以$1/0$结尾的散块的权值总和。

首先考虑散块的权值总和，由于末尾0不产生贡献。

$g_{i,0}=g_{i-1,1}+g_{i-1,0}$

考虑末尾的$1$会对所有序列产生贡献，所以贡献要乘上序列总数

$g_{i,1}=g_{i-1,0}+fib_{i+1} \cdot numg_{i-1,0}$

$numg_{i,0}=numg_{i-1,1}+numg_{i-1,0}$

$numg_{i,1}=numg_{i-1,0}$

接下来考虑整块的权值和，整块可以由一个整块，一个散块和一个末尾数字1组成

$f_i=\sum_{j=1}^{i-1} g_{i,1} \cdot numf_{i-j-1}+f_{i-j-1} \cdot numg_{j,1}$

$numf_i=\sum_{j=1}^{i-1}numg_{j,1} \cdot numf_{i-j-1}$

那么答案就是
$ans_i=\sum_{j=2}^{i}f_j \cdot (numg_{i-j,0}+numg_{i-j,1})$
### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const ll mod=1e9+7;
const int N=5e3+10;
int n;
ll fib[N];
ll f[N],g[N][2],numf[N],numg[N][2];
ll ans[N];
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n;
    fib[1]=1;
    fib[2]=1;
    for(int i=3;i<=n+1;i++) fib[i]=(fib[i-1]+fib[i-2])%mod;
    numg[0][0]=1;
    numf[0]=1;
    for(int i=1;i<=n;i++)
    {
        numg[i][0]=(numg[i-1][0]+numg[i-1][1])%mod;
        numg[i][1]=(numg[i-1][0])%mod;
        g[i][0]=(g[i-1][1]+g[i-1][0])%mod;
        g[i][1]=(g[i-1][0]+numg[i-1][0]*fib[i+1]%mod)%mod;
        for(int j=1;j<=i-1;j++)
        {
            ans[i]=(ans[i]+f[j]*(numg[i-j][0]+numg[i-j][1])%mod)%mod;
        }
    }
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=i-1;j++)
        {
            numf[i]=(numf[i]+numg[j][1]*numf[i-j-1]%mod)%mod;
            f[i]=(f[i]+g[j][1]*numf[i-j-1]%mod+f[i-j-1]*numg[j][1]%mod)%mod;
        }
    }
    for(int i=1;i<=n;i++)
    {
        for(int j=2;j<=i;j++)
        {
            ans[i]=(ans[i]+f[j]*(numg[i-j][0]+numg[i-j][1])%mod)%mod;
        }
        cout<<ans[i]<<' ';
    }
    return 0;
}
```
</details>