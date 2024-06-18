#include <iostream>
#include <vector>
#include <set>
#include <algorithm>

struct job {
    unsigned int len; // in minutes
    unsigned int reward; // in dollars
};

std::set<job> p1(const std::vector<job>& jobs, unsigned int T) {
    std::set<job> S;
    std::vector<job> J = jobs;

    // Using std::sort instead of mergesort for simplicity
    std::sort(J.begin(), J.end(), [](const job& a, const job& b) {
        return a.len <= b.len;
    });

    unsigned int t = 0;
    for (const auto& j : J) {
        if (t + j.len <= T) {
            S.insert(j);
            t += j.len;
        }
    }
    return S;
}

int main() {
    std::vector<job> jobs = {{30, 100}, {20, 200}, {10, 50}, {40, 150}};
    unsigned int T = 60; // Total available time in minutes

    std::set<job> selected_jobs = p1(jobs, T);

    std::cout << "Selected jobs:\n";
    for (const auto& j : selected_jobs) {
        std::cout << "Length: " << j.len << " minutes, Reward: " << j.reward << " dollars\n";
    }

    return 0;
}
