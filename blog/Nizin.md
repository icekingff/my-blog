---
title: (COCI 2016/2017 2) Nizin
date: 2026-8-26
tags: [贪心,题解,COCI,普及-]
---
{/* truncate */}
## 题解
### 题意

给定一个长度为 `n` 的正整数数组 `A`。

目标：通过若干次操作，将数组变为回文数组（即满足 `A[i] = A[n-i+1]`）。

允许的操作：每次选择数组中两个**相邻**的元素，将它们合并成一个新元素，新元素的值为这两个元素之和，数组长度减少 1。

要求：求出达成目标所需的**最少操作次数**。

---

**数据范围**

- `1 ≤ n ≤ 10^6`
- `1 ≤ a_i ≤ 10^9`
- 所有输入均为整数

---
### 解法
按理来说一眼秒的贪心。~~为什么卡2小时20分~~

我们发现左右端点的数限制最大。因为他们只能向中间合并。

而我们需要保证这个序列回文。于是就必须满足左右端点相同。

考虑枚举两个指针分别指向左右端点，判断如果其中一方小于另一方，那么就向中间合并一个数，直到两者相等。

接下来这两个端点就不用管了，因为他们已经满足回文，所以两个指针就同时向中间移动一格，按照相同的方式进行合并即可，直到两个指针指向同一格结束。

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=1e6+10;
int n;
ll a[N];
int main()
{
    // freopen("nizin2.in","r",stdin);
    // freopen("2.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n;
    for(int i=1;i<=n;i++) cin>>a[i];
    int cnt=0;
    for(int i=1,j=n;i<=j;i++,j--)
    {
        ll nowl=a[i],nowr=a[j];
        while(nowl!=nowr&&i<j)
        {
            if(nowl<nowr) 
            {
                nowl+=a[++i];
            }
            else nowr+=a[--j];
            cnt++;
        } 
    }
    cout<<cnt;
    return 0;
}
```
</details>

### 废话
考场上想着从中间断点往两边跑，结果卡了$50$分钟发现断点也可能是一个区间的和，心态直接爆炸。


