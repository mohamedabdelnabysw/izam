import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center border-2 border-black rounded-sm px-2 py-1 bg-white">
            <AppLogoIcon className="w-8 h-8 text-black mr-2" />
            <span className="font-bold text-xl text-black">izam</span>
        </div>
    );
}
