//
//  LoginViewModel.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import Clerk
import Foundation

@Observable
final class LoginViewModel {
    var email = "peter"
    var password = "11111111"
    var isLoading = false
    var showingAlert = false
    var alertMessage = ""
    
    func login() async {
        guard !isLoading else { return }
        
        guard !email.isBlank && !password.isEmpty else {
            alertMessage = "Please fill in all fields"
            showingAlert = true
            return
        }
        
        isLoading = true
        
        do {
            try await SignIn.create(
                strategy: .identifier(email, password: password)
            )
        } catch {
            alertMessage = error.localizedDescription
            showingAlert = true
            dump(error)
        }
        
        isLoading = false
    }
}
