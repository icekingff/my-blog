---
title: (COCI 2023/2024 5) Bitovi
date: 2026-8-25
---
## 题解
### 题意
给定两个集合$A,B$，存在一种操作,选择两个数$x,y$要求
$x \leq 2^{15},y \leq 2^{15},x \in A,y \notin A$且$x \bigotimes y$的二进制表示中只有一位为$1$

求如何操作使得$A=B$ 要求操作数$N \leq 2^{19}$

范围：$$|A| \leq 2^{15}$$
$$|B| \leq 2^{15}$$

{/* truncate */}

### 解法
简单构造题

注意操作数限制，假设我们改变每个数的每一位，最多操作$15 \cdot 2^{15} < 2^{19}$所以假设没有$y \notin A$的限制，只需暴力修改即可。

具体做法是跑一个双指针并记录集合$A，B$中那些数已经配对，然后选出两个没配对的数做异或运算。就能算出当前数要改变哪些位置才能转变为$B$集合中的数。

接下来解决$y \notin A$的问题。

我们考虑每次操作时，如果当前$y \in A$,那么我们可以先不进行此操作，暂存下来，用集合中已有的$y$继续进行接下来的操作，在一系列操作完成后，再进行此操作，恢复$y$。

**注意** 在进行暂存下来的操作时，要从后往前做，因为执行暂存操作的条件是后续操作全部做完。

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=2e6+10;
int n;
int a[N],b[N];
int visa[N],visb[N];
bool sama[N],samb[N];
struct node{
    int x,y;
};
vector<node> ans;
int main()
{   
    // freopen("1.in","r",stdin);
    // freopen("1.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n;
    for(int i=1;i<=n;i++) cin>>a[i],visa[a[i]]=true;
    for(int i=1;i<=n;i++) cin>>b[i],visb[b[i]]=true;
    for(int i=1;i<=n;i++)
    {   
        if(visb[a[i]]) sama[i]=true;
        if(visa[b[i]]) samb[i]=true;
    }
    vector<pair<int,int>> s;
    for(int i=1,j=1;i<=n;i++)
    {
        while(samb[j]&&j<=n) j++;
        if(j>n) break;
        if(sama[i]) continue;
        int t=a[i]^b[j];
        int now=a[i];
        s.clear();
        for(int i=0;i<=15;i++)
        {
            if(t&(1<<i))
            {
                if(visa[now^(1<<i)]) 
                {
                    s.push_back({now,now^(1<<i)});
                }
                else ans.push_back({now,now^(1<<i)});
                now=now^(1<<i);
            }
        }
        for(int i=s.size()-1;i>=0;i--) ans.push_back({s[i].first,s[i].second});
        visa[a[i]]=false;
        visa[now]=true;
        a[i]=now;
        sama[i]=true;
        samb[j]=true;
    }
    // cout<<ans.size()<<'?'<<'\n';
    cout<<ans.size()<<'\n';
    for(int i=0;i<ans.size();i++) cout<<ans[i].x<<' '<<ans[i].y<<'\n';
    return 0;
}
```
</details>

