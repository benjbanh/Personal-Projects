def dpcc(N, d):
    if (N == 0):
        return 0
    ans = N+1; 
    for i in range(0,len(d)):
        if (N >= d[i]):
            ans = min(ans, 1 + dpcc(N-d[i], d))
    return ans

print(dpcc(11,[1,2,5]))