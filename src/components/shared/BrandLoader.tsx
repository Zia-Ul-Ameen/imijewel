import styles from './BrandLoader.module.css';

export const BrandLoader = ({ fullScreen = true }: { fullScreen?: boolean }) => {
    return (
        <div className={`${fullScreen ? "fixed inset-0 z-[9999] bg-black" : "w-full h-full min-h-[400px]"} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-6">
                <div className={`${styles.keyboard} font-rethink flex items-center justify-center`}>
                    <span className={`${styles.key} font-rethink`}>S</span>
                    <span className={`${styles.key} font-rethink`}>B</span>
                    <span className={`${styles.key} font-rethink`}>A</span>
                    <span className={`${styles.key} font-rethink`}>Z</span>
                    <span className={`${styles.key} font-rethink`}>W</span>
                    <span className={`${styles.key} font-rethink`}>I</span>
                    <span className={`${styles.key} font-rethink`}>D</span>
                    <span className={`${styles.key} font-rethink`}>E</span>
                </div>
            </div>
        </div>
    );
};
