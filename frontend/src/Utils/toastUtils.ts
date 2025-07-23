import { toast, ToastOptions } from "react-toastify";

interface ToastParams {
	id: string;
	message: string;
	type: "info" | "success" | "error" | "warning";
	autoClose?: number | false;
	position?:
		| "top-right"
		| "top-center"
		| "top-left"
		| "bottom-right"
		| "bottom-center"
		| "bottom-left";
}

export const showToast = ({
	id,
	message,
	type,
	autoClose = 3000,
	position = "top-right",
}: ToastParams) => {
	const options: ToastOptions = {
		toastId: id,
		position,
		autoClose,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	};

	// Check if the toast with this ID is already active
	if (!toast.isActive(id)) {
		switch (type) {
			case "info":
				toast.info(message, options);
				break;
			case "success":
				toast.success(message, options);
				break;
			case "error":
				toast.error(message, options);
				break;
			case "warning":
				toast.warning(message, options);
				break;
			default:
				toast.info(message, options);
		}
	}
};

export const dismissToast = (id: string) => {
	toast.dismiss(id);
};

export const TOAST_IDS = {
	FACULTY_REPORT_LOADING: "faculty-report-loading",
	FACULTY_REPORT_SUCCESS: "faculty-report-success",
	FACULTY_REPORT_ERROR: "faculty-report-error",
	FACULTY_REPORT_EMPTY: "faculty-report-empty",
	FACULTY_EXPORT_SUCCESS: "faculty-export-success",
	FACULTY_EXPORT_ERROR: "faculty-export-error",
};
