---
title: (COCI 2016/2017 3) Kroničan
date: 2026-8-26
tags: [动态规划DP,状态压缩,题解,COCI,普及+/提高-]
---
{/* truncate */}
## 题解
### 题意

给定 N 个杯子，初始每个杯子都有水。操作：选择两个不同的杯子 i 和 j，将杯子 i 中的所有水倒入杯子 j，代价为 C[i][j]，倒完后杯子 i 为空。目标：经过若干次操作后，使有水的杯子数量不超过 K。求达成目标所需的最小总代价。

---

**数据范围**

- 1 ≤ K ≤ N ≤ 20
- 0 ≤ C[i][j] ≤ 10^5
- C[i][i] = 0
- 所有输入为整数

---
### 解法
观察数据范围发现显然状态压缩。

考虑设计状态，令$i$用二进制表示水杯的装水情况。$f_i$表示改情况下达到目标所需最小代价。

转移很显然$f_i=min(f_{j}+c_{x,y})$

其中$j$与$i$的二进制表示中只有第$x$位不同且$i$为$1$，$j$为$0$。$y$为任意除$x$以为$i$的二进制表示中为$1$的一位。

### 代码
<details>
<summary>code</summary>

```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const ll inf=1e18;
const int N=2e6+10;
int n,k;
int c[22][22];
ll f[N];
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>k;
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=n;j++) cin>>c[i][j];
    }
    vector<int> v;
    for(int i=0;i<(1<<n);i++)
    {
        f[i]=inf;
        int cnt=0;
        v.clear();
        for(int j=0;j<n;j++)
        {
            if(i&(1<<j))
            {
                cnt++;
                v.push_back(j);
            }
        }
        if(cnt<=k)
        {
            f[i]=0;
            continue;
        } 
        for(int j=0;j<v.size();j++)
        {
            for(int t=0;t<v.size();t++)
            {
                if(j==t) continue;
                int x=v[j],y=v[t];
                f[i]=min(f[i],f[i^(1<<x)]+c[x+1][y+1]);
            }
        }
        // cout<<f[i]<<' ';
    }
    cout<<f[(1<<n)-1];
    return 0;
}
```
</details>

