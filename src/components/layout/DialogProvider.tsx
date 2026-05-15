import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface DialogOptions {
    title: string;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

interface AlertOptions {
    title: string;
    message: ReactNode;
    buttonText?: string;
}

interface DialogContextType {
    confirm: (options: DialogOptions) => Promise<boolean>;
    alert: (options: AlertOptions) => Promise<void>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}

export default function DialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'confirm' | 'alert'>('confirm');
    const [options, setOptions] = useState<DialogOptions & AlertOptions>({
        title: '',
        message: '',
    });

    // Store the promise resolvers
    const [resolveConfirm, setResolveConfirm] = useState<(value: boolean) => void>();
    const [resolveAlert, setResolveAlert] = useState<() => void>();

    const confirm = useCallback((opts: DialogOptions) => {
        setOptions({ ...opts, buttonText: '' }); // Overwrite unused alert fields
        setType('confirm');
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolveConfirm(() => resolve);
        });
    }, []);

    const alert = useCallback((opts: AlertOptions) => {
        setOptions({ ...opts });
        setType('alert');
        setIsOpen(true);
        return new Promise<void>((resolve) => {
            setResolveAlert(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        if (type === 'confirm' && resolveConfirm) resolveConfirm(true);
        if (type === 'alert' && resolveAlert) resolveAlert();
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (type === 'confirm' && resolveConfirm) resolveConfirm(false);
    };

    return (
        <DialogContext.Provider value={{ confirm, alert }}>
            {children}
            {isOpen && (
                <div
                    className="custom-dialog-overlay animate-fade-in"
                    onClick={type === 'confirm' ? handleCancel : handleConfirm}
                >
                    <div
                        className="custom-dialog-card animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="custom-dialog-title">{options.title}</h3>
                        <div className="custom-dialog-message">{options.message}</div>

                        <div className="custom-dialog-actions">
                            {type === 'confirm' && (
                                <button
                                    className="dialog-btn dialog-btn-cancel"
                                    onClick={handleCancel}
                                >
                                    {options.cancelText || 'Cancel'}
                                </button>
                            )}
                            <button
                                className={`dialog-btn ${options.danger ? 'dialog-btn-danger' : 'dialog-btn-primary'}`}
                                onClick={handleConfirm}
                            >
                                {type === 'confirm'
                                    ? options.confirmText || 'Confirm'
                                    : options.buttonText || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
}
