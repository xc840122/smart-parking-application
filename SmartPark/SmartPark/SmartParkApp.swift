//
//  SmartParkApp.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import Clerk
import SwiftUI

@main
struct SmartParkApp: App {
    private var clerk = Clerk.shared
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                if clerk.isLoaded {
                    if clerk.user != nil {
                        MainTabView()
                    } else {
                        LoginView()
                    }
                } else {
                    ProgressView()
                }
            }
            .environment(clerk)
            .task {
                clerk.configure(publishableKey: Config.clerkPublishableKey)
                try? await clerk.load()
            }
        }
    }
}
