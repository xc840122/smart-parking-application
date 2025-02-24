//
//  RegisterViewModel.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import Clerk
import Foundation

@Observable
final class RegisterViewModel {
    var email = ""
    var password = ""
    var code = ""
    var isVerifying = false
    var isLoading = false
    var showingAlert = false
    var alertMessage = ""
    
    var title: String {
        isVerifying ? "Verify Email" : "Create Account"
    }
    
    var subTitle: String {
        isVerifying ? "Enter the verification code sent to your email" : "Sign up to start parking smarter"
    }
    
    func signUp() async {
        guard !isLoading else { return }
        
        guard !email.isBlank && !password.isEmpty else {
            alertMessage = "Please fill in all fields"
            showingAlert = true
            return
        }
        
        isLoading = true
        
        do {
            let signUp = try await SignUp.create(
                strategy: .standard(emailAddress: email, password: password)
            )
            
            try await signUp.prepareVerification(strategy: .emailCode)
            // next step is verifying email address
            isVerifying = true
        } catch {
            alertMessage = error.localizedDescription
            showingAlert = true
            dump(error)
        }
        
        isLoading = false
    }
    
    func verifyEmail() async {
        guard !isLoading else { return }
        
        guard !code.isEmpty else {
            alertMessage = "Please enter code"
            showingAlert = true
            return
        }
        
        isLoading = true
        
        do {
            guard let signUp = await Clerk.shared.client?.signUp else {
                isVerifying = false
                return
            }
            
            try await signUp.attemptVerification(.emailCode(code: code))
        } catch {
            alertMessage = error.localizedDescription
            showingAlert = true
            dump(error)
        }
        
        isLoading = false
    }
}
