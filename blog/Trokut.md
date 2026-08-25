---
title: (COCI 2023/2024 5) Trokut
date: 2026-8-25
---
## 题解
### 题意
给定一个$n$边形，$Lucija，Ivan$进行一种游戏，从$Lucija$开始轮流进行。

在$n$边形中选择$2$个节点连线，要求该连线不能与过去的连线相交。

胜利条件为连出一个三角形。求在两人足够聪明的情况下谁会赢。

范围$n \leq 10^9$
### 解法
分析游戏发现，如果存在两个点被连线，那么接下来的人如果使用这两个点的任意一个连线，那么一定下一个人一定会赢。

所以在两个人足够聪明的情况下就不会使用已经连线的两个节点连线。

这就转化成了一个$Nim$博弈问题，每次游戏将$n$边形切割为两个子游戏，对子游戏求和然后递推出$SG$函数即可

具体的$SG(i)=mex(SG(j) \bigotimes SG(i-j-2))(0 \leq j \leq i-2)$

然后我们发现这个是$O(n^2)$的显然过不了。

但经过打表发现这个是有周期的$...$

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=5e5+10;
int T;
int n;
ll sg[N];
int mex(unordered_set<int> &s)
{
    int cnt=0;
    while(s.count(cnt)) cnt++;
    return cnt;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    sg[0]=0;
    sg[1]=0;
    sg[2]=1;
    for(int i=3;i<=2000;i++)
    {
        unordered_set<int> s;
        for(int j=0;j<=i-2;j++)
        {
            s.insert(sg[j]^sg[i-j-2]);
        }
        sg[i]=mex(s);
    }
    int T;
    cin>>T;
    while(T--)
    {
        cin>>n;
        if(n<=69) cout<<(sg[n]?"Lucija":"Ivan");
        else cout<<(sg[(n-70)%34+70]?"Lucija":"Ivan");
        cout<<'\n';
    }
    return 0;
}
```

</details>