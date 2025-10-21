

interface ConfirmModalProps {
    title: string,
    description: string,
    success: string,
    cancel: string,
    success_function: () => void,
    cancel_function: () => void,
}
export default function ConfirmModal({ title, description, cancel, success, success_function, cancel_function }: ConfirmModalProps) {

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">¿Estás seguro?</p>
                    </div>
                </div>
                <p className="text-gray-600 mb-6">
                    {description}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={cancel_function}
                        className="cursor-pointer flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                    >
                        {cancel}
                    </button>
                    <button
                        onClick={success_function}
                        className="cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                    >
                        {success}
                    </button>
                </div>
            </div>
        </div>
    )
}