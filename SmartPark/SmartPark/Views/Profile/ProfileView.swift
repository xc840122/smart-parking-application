//
//  ProfileView.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI
import Clerk

struct ProfileView: View {
    @Environment(Clerk.self) private var clerk
    @State private var showLogoutConfirmation = false

    var body: some View {
        VStack(spacing: 30) {
            // User Avatar and ID Section
            VStack {
                // Placeholder for user avatar
                Circle()
                    .fill(Color.black.opacity(0.7))
                    .frame(width: 100, height: 100)
                    .overlay(
                        Text("🧑🏻‍💻")
                            .font(.largeTitle)
                            .foregroundColor(.white)
                    )
                    .padding(.top, 40)
                
                // User ID with distinction
                if let user = clerk.user {
                    HStack {
                        Text("User ID:")
                            .font(.title2)
                            .fontWeight(.medium)
                            .foregroundColor(.black)
                                                
                        Text(user.id)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.gray)
                    }
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .padding(.top, 10)
                }
            }

            // Log out Button
            Button(action: {
                showLogoutConfirmation = true
            }) {
                Text("Sign Out")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.black)
                    .cornerRadius(10)
            }
            .alert("Are you sure you want to sign out?", isPresented: $showLogoutConfirmation) {
                Button("Sign Out", role: .destructive) {
                    Task {
                        try? await clerk.signOut()
                    }
                }
                Button("Cancel", role: .cancel) {}
            }
            
            Spacer()
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .navigationBarTitle("Profile", displayMode: .inline)
    }
}

#Preview {
    ProfileView()
}
