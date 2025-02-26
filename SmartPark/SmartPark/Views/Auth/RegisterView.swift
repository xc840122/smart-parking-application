//
//  RegisterView.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import SwiftUI

struct RegisterView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var viewModel = RegisterViewModel()
    
    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Title
                VStack(spacing: 16) {
                    Text(viewModel.title)
                        .font(.system(size: 24, weight: .bold))
                    Text(viewModel.subTitle)
                        .font(.system(size: 16))
                        .foregroundStyle(.gray)
                }
                .padding(.top, 40)
                
                // Form
                VStack(spacing: 20) {
                    if viewModel.isVerifying {
                        VerifyForm(viewModel: viewModel)
                    } else {
                        RegisterForm(viewModel: viewModel)
                    }
                }
                .padding(.horizontal, 24)
                
                if !viewModel.isVerifying {
                    // Back to Login
                    Button("Already have an account? Sign in") {
                        dismiss()
                    }
                    .foregroundStyle(.blue)
                    .padding(.top, 16)
                }
            }
        }
        .scrollBounceBehavior(.basedOnSize)
        .alert("Error", isPresented: $viewModel.showingAlert) {} message: {
            Text(viewModel.alertMessage)
        }

    }
}

struct RegisterForm: View {
    @Bindable var viewModel: RegisterViewModel
    
    var body: some View {
        // Email Field
        VStack(alignment: .leading, spacing: 8) {
            Text("Email")
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(.gray)
            
            TextField("Enter your email", text: $viewModel.email)
                .textFieldStyle(TextFieldStyles.Notion())
                .keyboardType(.emailAddress)
                .autocorrectionDisabled(true)
                .textInputAutocapitalization(.never)
        }
        // Password Field
        VStack(alignment: .leading, spacing: 8) {
            Text("Password")
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(.gray)
            
            SecureField("Create a password", text: $viewModel.password)
                .textFieldStyle(TextFieldStyles.Notion())
        }
        // Sign Up Button
        Button {
            Task {
                await viewModel.signUp()
            }
        } label: {
            ZStack {
                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(.white)
                } else {
                    Text("Create Account")
                        .font(.system(size: 16))
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
}

struct VerifyForm: View {
    @Bindable var viewModel: RegisterViewModel
    
    var body: some View {
        // Verification Code Field
        VStack(alignment: .leading, spacing: 8) {
            Text("Verification Code")
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(.gray)
            
            TextField("Enter code", text: $viewModel.code)
                .textFieldStyle(TextFieldStyles.Notion())
                .keyboardType(.numberPad)
        }
        // Verify Button
        Button {
            Task {
                await viewModel.verifyEmail()
            }
        } label: {
            ZStack {
                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(.white)
                } else {
                    Text("Verify Email")
                        .font(.system(size: 16))
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
}

#Preview {
    RegisterView()
}
