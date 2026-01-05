import { useAppSelector } from '@/hooks/redux';
import { LogoutButton } from '@/components/common/LogoutButton';

/**
 * Home/Dashboard page for authenticated users
 */
export const HomePage = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {user?.profileImage && (
                                <img
                                    src={user.profileImage}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Welcome back, {user?.firstName}!
                                </h1>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

                {/* Main Content Area - Placeholder */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Your Dashboard
                    </h2>
                    <p className="text-gray-600">
                        This is your main dashboard. Your tasks and lists will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};
