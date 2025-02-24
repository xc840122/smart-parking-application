//
//  LoginView.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import SwiftUI

struct LoginView: View {
    @State private var viewModel = LoginViewModel()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 32) {
                    // Logo and Title
                    VStack(spacing: 16) {
                        Image(systemName: "car.circle.fill")
                            .resizable()
                            .frame(width: 64, height: 64)
                            .foregroundStyle(.black)
                        Text("Welcome to Smart Park")
                            .font(.system(size: 24, weight: .bold))
                        Text("Sign in to manage your parking")
                            .font(.system(size: 16))
                            .foregroundStyle(.gray)
                    }
                    .padding(.top, 60)
                    
                    // Login Form
                    VStack(spacing: 20) {
                        // Email Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Email")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(.gray)
                            TextField("Enter your email", text: $viewModel.email)
                                .textFieldStyle(TextFieldStyles.Notion())
                                .keyboardType(.emailAddress)
                                .textInputAutocapitalization(.never)
                        }
                        // Password Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Password")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(.gray)
                            SecureField("Enter your password", text: $viewModel.password)
                                .textFieldStyle(TextFieldStyles.Notion())
                        }
                        // Sign In Button
                        Button {
                            Task {
                                await viewModel.login()
                            }
                        } label: {
                            ZStack {
                                if viewModel.isLoading {
                                    ProgressView()
                                        .progressViewStyle(.circular)
                                        .tint(.white)
                                } else {
                                    Text("Continue with Email")
                                        .font(.system(size: 16, weight: .medium))
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(.black)
                            .foregroundStyle(.white)
                            .clipShape(.rect(cornerRadius: 3))
                        }
                        .disabled(viewModel.isLoading)
                    }
                    .padding(.horizontal, 24)
                    
                    // Divider with "Or" text
                    HStack {
                        VStack {
                            Divider().padding(.horizontal, 24)
                        }
                        Text("or")
                            .font(.system(size: 14))
                            .foregroundStyle(.gray)
                        VStack {
                            Divider().padding(.horizontal, 24)
                        }
                    }
                    
                    // Sign Up Link
                    VStack(spacing: 8) {
                        Text("Don't have an account?")
                            .foregroundStyle(.gray)
                        NavigationLink {
                            RegisterView()
                        } label: {
                            Text("Create account")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundStyle(.blue)
                        }
                    }
                }
            }
            .background(Color(.systemBackground))
            .alert("Error", isPresented: $viewModel.showingAlert) {} message: {
                Text(viewModel.alertMessage)
            }
            .scrollBounceBehavior(.basedOnSize)
        }
    }
}

#Preview {
    LoginView()
}
