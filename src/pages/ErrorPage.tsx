import { useNavigate } from 'react-router-dom';

/**
 * Error Page Component
 * Displays when an unexpected error occurs in the application
 */
export const ErrorPage = () => {
    const navigate = useNavigate();
    /* const error = useRouteError() as Error & { statusText?: string }; */

    const handleGoToDashboard = () => {
        navigate('/home');
    };

    const handleReloadPage = () => {
        window.location.reload();
    };

    /* const handleErrorDetails = () => {
        console.error('Error details:', error);
        alert(`Error: ${error?.message || 'Unknown error'}`);
    };
 
    const handleGetSupport = () => {
        // TODO: Open support modal or navigate to support page
        window.open('mailto:support@taskmaster.com', '_blank');
    }; */

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        {/* Glowing background effect */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>

                        {/* Robot Icon */}
                        <div className="relative w-32 h-32 bg-gradient-to-br from-white to-gray-100 rounded-3xl flex items-center justify-center shadow-2xl">
                            <svg className="w-20 h-20 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c-1.1 0-2 .9-2 2v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2zm0 2c.55 0 1 .45 1 1v1h-2V5c0-.55.45-1 1-1zm-2 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4 3h4v1h-4v-1z" />
                                <circle cx="10" cy="9" r="1" fill="#3b82f6" />
                                <circle cx="14" cy="9" r="1" fill="#3b82f6" />
                                <path d="M9 13h6" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>

                            {/* Wrench icon */}
                            <svg className="absolute bottom-0 right-0 w-10 h-10 text-primary bg-white rounded-full p-1 shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Error Badge */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">
                            System Error: ERR_XXX
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-text-primary text-4xl md:text-5xl font-bold mb-4">
                    Oops, something went wrong!
                </h1>

                <p className="text-text-secondary text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                    We encountered an unexpected error while processing your request. Don't worry, your tasks are safe and sound. Try refreshing the page or head back home.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button
                        onClick={handleGoToDashboard}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Dashboard
                    </button>

                    <button
                        onClick={handleReloadPage}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card-dark hover:bg-background-primary-hover text-text-primary border border-border-dark font-medium rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reload Page
                    </button>
                </div>

                {/* Bottom Links */}
                {/* <div className="flex items-center justify-center gap-6 text-sm">
                    <button
                        onClick={handleErrorDetails}
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth={2} />
                            <path strokeLinecap="round" strokeWidth={2} d="M12 16v-4M12 8h.01" />
                        </svg>
                        Error Details
                    </button>

                    <button
                        onClick={handleGetSupport}
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Get Support
                    </button>
                </div> */}
            </div>
        </div>
    );
};
