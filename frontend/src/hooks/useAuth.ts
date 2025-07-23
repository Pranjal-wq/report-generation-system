import { create } from "zustand";
import { AuthState, UserRole } from "../types/auth";
import { localApiService } from "../api/base";

// This is the custom hook for handling authentication state

const storedUser = localStorage.getItem("user");
const persistedUser = storedUser ? JSON.parse(storedUser) : null;

interface AuthStore extends AuthState {
	login: (email: string, password: string, role: UserRole) => Promise<void>;
	logout: () => void;
}

const demoUsers: Record<UserRole, { id: string; email: string; role: UserRole; name: string }> = {
	FACULTY: {
		id: "1",
		email: "faculty@manit.ac.in",
		role: "FACULTY" as UserRole,
		name: "Ramesh Kumar Thakur",
	},
	HOD_CSE: {
		id: "2",
		email: "deepaktomar@manit.ac.in",
		role: "HOD_CSE" as UserRole,
		name: "Deepak Singh Tomar",
	},
	DIRECTOR: {
		id: "3",
		email: "director@manit.ac.in",
		role: "DIRECTOR" as UserRole,
		name: "Demo Director",
	},
	ADMIN: {
		id: "4",
		email: "admin@manit.ac.in",
		role: "ADMIN" as UserRole,
		name: "System Administrator",
	},
};

export const useAuth = create<AuthStore>((set) => ({
	// Initialize state from localStorage
	user: persistedUser,
	isAuthenticated: !!persistedUser,
	isLoading: false,
	login: async (email: string, password: string, role: UserRole) => {
		set({ isLoading: true });

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (password === "password123") {
			const user = {
				...demoUsers[role],
				...(role === "FACULTY" ? { name: "Ramesh Kumar Thakur" } : {}),
			};
			localStorage.setItem("user", JSON.stringify(user));
			set({ user, isAuthenticated: true, isLoading: false });
			
			// Show success toast using centralized service
			localApiService.showSuccess(`Welcome back, ${user.name}!`, "login-success");
		} else {
			set({ isLoading: false });
			// Show error toast using centralized service
			localApiService.showError("Invalid credentials. Please try again.", "login-error");
			throw new Error("Invalid credentials");
		}
	},
	logout: () => {
		// Remove persisted user on logout
		localStorage.removeItem("user");
		set({ user: null, isAuthenticated: false });
		
		// Show logout toast using centralized service
		localApiService.showInfo("You have been logged out successfully.", "logout-info");
	},
}));
