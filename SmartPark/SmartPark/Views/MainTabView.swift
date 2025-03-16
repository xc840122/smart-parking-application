//
//  MainTabView.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import SwiftUI

struct MainTabView: View {
    @State private var navigationManager = NavigationManager()
    @State private var selectedTab = "Home"

    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationStack(path: $navigationManager.homePath) {
                HomeView()
            }
            .tabItem {
                Label("Home", systemImage: "house.fill")
            }
            .tag("Home")

            NavigationStack(path: $navigationManager.bookingsPath) {
                BookingListView()
            }
            .tabItem {
                Label("Bookings", systemImage: "calendar")
            }
            .tag("Bookings")

            NavigationStack(path: $navigationManager.billingPath) {
                BillingView()
            }
            .tabItem {
                Label("Billing", systemImage: "creditcard.fill")
            }
            .tag("Billing")

            NavigationStack(path: $navigationManager.profilePath) {
                ProfileView()
            }
            .tabItem {
                Label("Profile", systemImage: "person.fill")
            }
            .tag("Profile")
        }
        .environmentObject(navigationManager)
        .environment(\.selectedTab, $selectedTab) // ✅ 让所有页面都能访问 `selectedTab`
        .tint(.black)
    }
}

#Preview {
    MainTabView()
}
