---
title: (COCI 2016/2017 3) Rima
date: 2026-8-26
tags: [动态规划DP,字典树Trie,树形DP,题解,COCI,提高]
---
{/* truncate */}
## 题解
### 题意

给定 N 个互不相同的字符串，由小写字母组成。定义两个字符串 A、B 的"押韵"关系为：它们的最长公共后缀长度 ≥ max(|A|, |B|) - 1。要求从这些字符串中选出尽可能多的字符串排成一个序列，使得序列中任意相邻的两个字符串都押韵。求该序列的最大可能长度（即最多能选多少个字符串）。

---
**数据范围**

- 1 ≤ N ≤ 5 × 10^5
- 所有字符串总长度 ≤ 3 × 10^6
- 字符串由小写字母组成
- 所有字符串互不相同

---
### 解法
注意题意中的最长公共后缀。

显然我们可以把所有字符串反转过来，那么就是最长公共前缀。

为什么这样做呢？当然是因为这样就可以在字典树上维护了。

发现题目中的要求相邻两个字符串只能有首字母不同。

这就等价于在字典树上一个字符串末尾的儿子节点或者兄弟节点是另一个字符串的末尾。

于是我们可以用树形$dp$来做。

我们在建立字典树时给每个字符串末尾的节点打上标记。我们从$0$号节点开始$dfs$。

分别考虑标记过的节点和没标记过的节点。

$1.$对于没标记过的节点，首先是这个节点的所有标记过的直接儿子都可以进入序列中，这个序列可以向两边延伸，所以这个节点对应的答案可以加上其中最大和次大两个儿子继续向内延伸的答案

$2.$对于标记过的节点，计算答案的方式与没标记的节点一样，但还要加上这个节点，除此之外记录向内延伸的答案就是最大的儿子向内延伸的答案加上所后标记过的直接儿子的数量。

最后输出每个节点答案中的最大值即可。

### 代码
<details>
<summary>code</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=3e6+10;
int n;
int tire[N][26],tot;
int idx[N];
inline void insert(string s)
{
    int x=0;
    for(int i=int(s.size())-1;i>=0;i--)
    {
        if(!tire[x][s[i]-'a'])
        {
            tire[x][s[i]-'a']=++tot;
        }
        x=tire[x][s[i]-'a'];
    }
    idx[x]++;
}
int f[N];
int ans;
void dfs(int x)
{
    int maxx1=0,maxx2=0,siz=0;
    for(int i=0;i<26;i++)
    {
        int y=tire[x][i];
        if(!y) continue;
        dfs(y);
        if(idx[y]>0) siz++;
        if(f[y]>=maxx1) maxx2=maxx1,maxx1=f[y];
        else if(f[y]>maxx2) maxx2=f[y];
    }
    if(idx[x]>0) f[x]=maxx1+max(siz,1);
    ans=max(ans,maxx1+maxx2+idx[x]+max(siz-2,0));
}
int main()
{
    // freopen("rima.in","r",stdin);
    // freopen("4.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n;
    for(int i=1;i<=n;i++)
    {
        string s;
        cin>>s;
        insert(s);
    }
    dfs(0);
    cout<<ans;
    return 0;
}
```
</details>