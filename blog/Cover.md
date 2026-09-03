---
title: (COCI 2017/2018 6) Cover
date: 2026-9-3
tags: [动态规划DP,斜率优化,COCI,题解,提高]
---
{/* truncate */}
## 题解
### 题意
给定平面直角坐标系中的 **N** 个点，坐标满足 **XY ≠ 0**（即点不在坐标轴上）。

需要用**一个或多个**中心在原点的轴对齐矩形覆盖所有点。每个矩形的中心均为原点 **(0, 0)**，边平行于坐标轴。点可以在矩形内部或边界上。

目标是最小化所有选中矩形的面积之和。

**数据范围**

- **1 ≤ N ≤ 5000**
- **-50,000,000 ≤ X, Y ≤ 50,000,000**
- **XY ≠ 0**（即每个点不在 x 轴或 y 轴上）
- 对于 40% 的数据：**N ≤ 20**

### 解法
首先这道题我们观察到，矩阵的中心一定是在原点上，就说明我们不需要关心点所在的象限，而对于每个点而言，覆盖它的最小矩阵大小就是长$2\cdot \left|x \right|$,宽$2\cdot \left|y \right|$的矩阵。

然后我们发现，如果存在一个点对$a,b$满足$|a_x|\leq|b_x|$且$|a_y|\leq|b_y|$那么我们只要创造出一个能覆盖$b$的矩阵，就一定能同时覆盖$a$,那么其实这个$a$是一个无用点。

我们要如何去除这些无用点呢？考虑现将所有点按照$x$从小到大排序（注意是取了绝对值后的）然后维护一个单调栈，如果我们枚举到一个点这个点的$y$比栈顶大，就说明栈顶的点是无用点，就弹出栈顶，最后把这个点加入栈顶。

这样我们就维护了一个$x$单调递增，$y$单调递减的序列。并去除了所有无用点。

那么最后答案怎么计算呢？我们发现由于这个序列的单调性，如果我们创造一个可以覆盖多个点的矩阵，那么这些点一定是一段连续的区间。

假设我们存在两个点$p,q$且$p$在$q$前面，那么如果我们要创造一个覆盖这两个点的矩阵，那么这个矩阵一定满足长大于等于$2 \cdot q_x$宽度小于等于$2 \cdot p_y$而由于序列$x$单调递增$y$单调递减，$p$到$q$之间的数的$x$一定小于等于$q_x$,$y$一定小于等于$p_y$那么这些点一定也会被这个矩阵覆盖掉。

于是我们可以设计状态$f_i$表示覆盖前$i$个点矩阵的最小面积之和，转移方程很简单

$$
f_i=\min_{j=0}^{i-1}(f_j+4 \cdot x_i \cdot y_{j+1})
$$

这个转移是$O(n^2)$的，这个题能过。

不过我们观察这个式子，似乎只是存在一个$f(i) \cdot g(j)$的项可以使用斜率优化。

时间复杂度为$O(n)$

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=5e4+10;
const ll inf=1e18;
int n;
struct node{
    ll x,y;
    bool operator<(const node &b) const
    {
        return x<b.x;
    }
}a[N];
int q[N];
ll f[N];
vector<int> c;
bool check(int i,int t,int j)
{
    return (__int128)(f[i]-f[t])*(a[c[j+1]].y-a[c[t+1]].y)<=(__int128)(f[t]-f[j])*(a[c[t+1]].y-a[c[i+1]].y);
}
int main()
{
    // freopen("3.in","r",stdin);
    // freopen("3.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n;
    for(int i=1;i<=n;i++)
    {
        cin>>a[i].x>>a[i].y;
        a[i].x=abs(a[i].x);
        a[i].y=abs(a[i].y);
    } 
    sort(a+1,a+n+1);
    a[0].y=inf;
    c.push_back(0);
    for(int i=1;i<=n;i++)
    {
        while(c.size()&&a[c.back()].y<=a[i].y) c.pop_back();
        c.push_back(i);
    }
    int l=1,r=1;
    q[l]=0;
    // cout<<f[0]<<' '<<a[c[0+1]].y<<' '<<q[l]<<' '<<q[r]<<'\n';
    for(int i=1;i<c.size();i++)
    {
        while(l<r&&a[c[i]].x*a[c[q[l]+1]].y+f[q[l]]>=a[c[i]].x*a[c[q[l+1]+1]].y+f[q[l+1]]) l++;
        f[i]=a[c[i]].x*a[c[q[l]+1]].y+f[q[l]];
        while(l<r&&check(i,q[r],q[r-1])) r--;
        q[++r]=i;
        // cout<<f[i]<<' '<<a[c[i+1]].y<<' '<<q[l]<<' '<<q[r]<<'\n';
    }
    cout<<f[c.size()-1];
    return 0;
}
```
</details>
