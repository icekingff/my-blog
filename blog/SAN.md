---
title: (COCI 2015/2016 6) SAN
date: 2026-9-8
tags: [深度优先搜索DFS,COCI,题解,省选/NOI-]
---
{/* truncate */}
## 题解
### 题意
有一张无限大的表格，行号和列号均从 **1** 开始。定义函数 **rev(i)** 为将整数 **i** 的十进制表示翻转后得到的整数（前导零省略，例如 rev(406800) = 8604）。

表格第 **i** 行第 **j** 列的数字 **A(i, j)** 定义如下：
- **A(i, 1) = i**
- 对于 **j > 1**，**A(i, j) = A(i, j-1) + rev(A(i, j-1))**

也就是说，每一行的第一个数是行号，之后的每个数都是前一个数加上它自身的翻转值。

已知表中的每个数字出现次数有限。有 **Q** 组询问，每组询问给定区间 **[L, R]**，求无限表中所有大小在 **[L, R]** 内的数字的总个数（重复出现的数字按多次计数）。

**数据范围**
- **1 ≤ Q ≤ 10⁵**
- **1 ≤ L, R ≤ 10¹⁰**
- 对于 50% 的数据：**1 ≤ L, R ≤ 10⁶**

### 解法

首先有个十分显然的做法，可以类似做一个$dp$。设当前$x$这个数出现的次数为$cnt_x$由于这个数的$x+rep(x)$是固定的，那么$cnt_{x+rep(x)}$
就加上$x$的出现次数，因为每一个$x$后面的数一定是$x+rep(x)$。由于$x+rep(x)>x$所以当我们从小到大枚举，当我们枚举到一个数的时候，这个数的$cnt$一定是计算好的，查询区间我们只需要做一个前缀和就可以$O(1)$计算，所以总时间复杂度是$O(MAXR+Q)$的。但是$R$太大了显然会超时。

我们考虑对这个算法进行优化。其实很容易想到，对于第二列的数$\leq 1e10$的数是比较少的，而第一列的贡献单独计算是很容易的。所以我们可以考虑暴力计算第二列有那些数，然后从第二列开始递推，可以离散化后计算前缀和二分处理查询。

这个计算第二列的元素直接使用一个$dfs$即可，对于爱打暴力的小朋友来说是十分简单的~~但是我不爱打暴力~~。这里我将一些实现中的细节。

首先，对于所有第二列的数，如果不考虑进位，那么他的每一位一定是$<18$的，然后对于一个数$p_1p_2p_3p_4p_5$(这里拿五位数举例)其中$0 \leq p_i \leq18$他的组成方案就是每一位被拆成两个大于等于$0$小于等于$9$的数的方案数相乘。但是注意，对于只有奇数位的数,他中间的那一位如$p_3$只能是偶数，且只有一种拆的方案。因为奇数位的数反转后中间那一位是不变的。

其次对于第一位的数的拆法，第一个数不能被拆成$0+p_1$因为这样前导零是不合法的，但是可以被拆成$p_1+0$这因为反转后存在前导零是合法的。

如果$dfs$枚举到同样的数，那么权值是要相加的，因为这还是不同的数组成的结果。

那么这道题做完了。

由于空间限制很小，本人自己根本卡不过，让$AI$卡了一下空间。

### 代码
<details>
<summary>codeme</summary>
```cpp
#include<bits/stdc++.h>
using namespace std;
using ll=long long;
map<ll,ll> sum;
ll pw[20];
inline void dfs(int i,int len,ll now,ll cnt,bool flag)
{
    // cout<<len<<' '<<flag<<'\n';
    for(int k=0;k<=18;k++)
    {
        if(i==1&&k==0) continue;
        if(i==1)
        {
            if(i==len)
            {
                if(flag)
                {
                    if(k%2) continue;
                    sum[now+k*pw[len]]+=cnt;
                }
                else
                {
                    if(k<=9) sum[now+k*pw[len]+k*pw[len+1]]+=cnt*k;
                    else sum[now+k*pw[len]+k*pw[len+1]]+=cnt*(18ll-k+1ll);
                }
                continue;
            }
            if(flag)
            {
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*k,flag);
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*(18ll-k+1ll),flag);
            }
            else 
            {
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*k,flag);
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*(18ll-k+1ll),flag);
            }
        }
        else 
        {
            if(i==len)
            {
                if(flag)
                {
                    if(k%2) continue;
                    sum[now+k*pw[len]]+=cnt;
                }
                else
                {
                    if(k<=9) sum[now+k*pw[len]+k*pw[len+1]]+=cnt*(k+1);
                    else sum[now+k*pw[len]+k*pw[len+1]]+=cnt*(18ll-k+1ll);
                }
                continue;
            }
            if(flag)
            {
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*(k+1),flag);
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*(18ll-k+1ll),flag);
            }
            else 
            {
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*(k+1),flag);
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*(18ll-k+1ll),flag);
            }
        }
    }   
    return ;
}
ll rep(ll x)
{
    ll ans=0;
    while(x)
    {
        ans=ans*10ll+x%10ll;
        x/=10;
    }
    return ans;
}
void solve()
{
    pw[1]=1;
    for(int i=2;i<=10;i++) pw[i]=pw[i-1]*10ll;
    for(int len=1;len<=5;len++)
    {
        dfs(1,len,0,1,1);
        dfs(1,len,0,1,0);
    }
    ll summ=0;
    sum[0]=0;
    for(auto x:sum)
    {
        ll now=x.first,cnt=x.second;
        // if(now<=20) cout<<now<<' '<<cnt<<' '<<now+rep(now)<<'\n';
        if(now+rep(now)<=1e10) sum[now+rep(now)]+=cnt;
        sum[now]+=summ;
        summ+=cnt;
    }
}
int main()
{
    // freopen("3.in","r",stdin);
    // freopen("3.out","w",stdout);
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    int n;
    cin>>n;
    for(int i=1;i<=n;i++)
    {
        ll l,r;
        cin>>l>>r;
        auto begin=sum.lower_bound(l),end=sum.upper_bound(r);
        --begin;
        --end;
        cout<<end->second-begin->second+(r-l+1)<<'\n';
        // cout<<end->second<<' '<<begin->second<<'\n';
    }
    return 0;
}
```

</details>
<details>
<summary>codeAi</summary>
```cpp
#include<bits/stdc++.h>  
using namespace std;  
using ll=long long;  
#pragma pack(1)  
struct node  
{  
    ll x;  
    int cnt;  
};  
#pragma pack()  
vector<node> b;  
ll pw[20];  
const ll LIMIT=10000000000ll;  
inline void add(ll x,ll cnt)  
{  
    if(x<=LIMIT) b.push_back({x,(int)cnt});  
}  
inline void dfs(int i,int len,ll now,ll cnt,bool flag)  
{  
    for(int k=0;k<=18;k++)  
    {  
        if(i==1&&k==0) continue;  
        if(i==1)  
        {  
            if(i==len)  
            {  
                if(flag)  
                {  
                    if(k%2) continue;  
                    add(now+k*pw[len],cnt);  
                }  
                else  
                {  
                    if(k<=9)  
                    {  
                        add(now+k*pw[len]+k*pw[len+1],cnt*k);  
                    }   
                    else  
                    {  
                        add(now+k*pw[len]+k*pw[len+1],cnt*(18ll-k+1ll));  
                    }   
                }  
                continue;  
            }  
            if(flag)  
            {  
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*k,flag);  
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*(18ll-k+1ll),flag);  
            }  
            else   
            {  
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*k,flag);  
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*(18ll-k+1ll),flag);  
            }  
        }  
        else   
        {  
            if(i==len)  
            {  
                if(flag)  
                {  
                    if(k%2) continue;  
                    add(now+k*pw[len],cnt);  
                }  
                else  
                {  
                    if(k<=9)  
                    {  
                        add(now+k*pw[len]+k*pw[len+1],cnt*(k+1));  
                    }   
                    else  
                    {  
                        add(now+k*pw[len]+k*pw[len+1],cnt*(18ll-k+1ll));  
                    }   
                }  
                continue;  
            }  
            if(flag)  
            {  
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*(k+1),flag);  
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i],cnt*(18ll-k+1ll),flag);  
            }  
            else   
            {  
                if(k<=9) dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*(k+1),flag);  
                else dfs(i+1,len,now+k*pw[i]+k*pw[2*len-i+1],cnt*(18ll-k+1ll),flag);  
            }  
        }  
    }     
}  
ll rep(ll x)  
{  
    ll ans=0;  
    while(x)  
    {  
        ans=ans*10ll+x%10ll;  
        x/=10;  
    }  
    return ans;  
}  
bool cmpx(const node &a,const node &b)  
{  
    return a.x<b.x;  
}  
int getpos(ll x)  
{  
    int l=0,r=b.size();  
    while(l<r)  
    {  
        int mid=(l+r)>>1;  
        if(b[mid].x<x) l=mid+1;  
        else r=mid;  
    }  
    return l;  
}  
void solve()  
{  
    pw[1]=1;  
    for(int i=2;i<=10;i++) pw[i]=pw[i-1]*10ll;  
    b.reserve(3779307);  
    b.push_back({0,0});  
    for(int len=1;len<=5;len++)  
    {  
        dfs(1,len,0,1,1);  
        dfs(1,len,0,1,0);  
    }  
    sort(b.begin(),b.end(),cmpx);  
    int m=0;  
    for(int i=0;i<b.size();i++)  
    {  
        if(!m||b[m-1].x!=b[i].x)  
        {  
            b[m++]=b[i];  
        }  
        else  
        {  
            b[m-1].cnt+=b[i].cnt;  
        }  
    }  
    b.resize(m);  
    for(int i=0;i<b.size();i++)  
    {  
        ll now=b[i].x;  
        ll nxt=now+rep(now);  
        if(b[i].cnt&&nxt<=LIMIT)  
        {  
            int pos=getpos(nxt);  
            if(pos<b.size()&&b[pos].x==nxt)  
            {  
                b[pos].cnt+=b[i].cnt;  
            }  
        }  
    }  
}  
struct query  
{  
    ll x;  
    int id;  
    int type;  
};  
int main()  
{  
    // freopen("3.in","r",stdin);  
    // freopen("3.out","w",stdout);  
    ios::sync_with_stdio(false);  
    cin.tie(nullptr);  
    solve();  
    int n;  
    cin>>n;  
    vector<query> q;  
    vector<ll> ans(n);  
    q.reserve(2*n);  
    for(int i=0;i<n;i++)  
    {  
        ll l,r;  
        cin>>l>>r;  
        q.push_back({r,i,1});  
        q.push_back({l-1,i,-1});  
        ans[i]=r-l+1;  
    }  
    sort(q.begin(),q.end(),[](const query &a,const query &b)  
    {  
        return a.x<b.x;  
    });  
    ll summ=0;  
    int pos=0;  
    for(int i=0;i<q.size();i++)  
    {  
        while(pos<b.size()&&b[pos].x<=q[i].x)  
        {  
            summ+=b[pos].cnt;  
            pos++;  
        }  
        ans[q[i].id]+=q[i].type*summ;  
    }  
    for(int i=0;i<n;i++)  
    {  
        cout<<ans[i]<<'\n';  
    }  
    return 0;  
}

```

</details>
