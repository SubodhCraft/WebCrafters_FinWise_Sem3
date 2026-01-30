import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('NPR');
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);
    const EXCHANGE_RATE = 149; // 1 USD = 149 NPR

    // Load preferences from localStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem('preferredCurrency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
        const savedPrivacy = localStorage.getItem('privacyMode');
        if (savedPrivacy === 'true') {
            setIsPrivacyMode(true);
        }
    }, []);

    // Save currency preference to localStorage
    const toggleCurrency = () => {
        const newCurrency = currency === 'NPR' ? 'USD' : 'NPR';
        setCurrency(newCurrency);
        localStorage.setItem('preferredCurrency', newCurrency);
    };

    const togglePrivacyMode = () => {
        const newMode = !isPrivacyMode;
        setIsPrivacyMode(newMode);
        localStorage.setItem('privacyMode', newMode);
    };

    // Format amount based on current currency
    const formatAmount = (amountInNPR) => {
        if (isPrivacyMode) return 'XXXX';
        if (!amountInNPR && amountInNPR !== 0) return '0.00';

        const amount = parseFloat(amountInNPR);
        if (isNaN(amount)) return '0.00';

        if (currency === 'NPR') {
            return amount.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            const usdAmount = amount / EXCHANGE_RATE;
            return usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    };

    // Get currency symbol
    const getCurrencySymbol = () => {
        return currency === 'NPR' ? 'NPR' : '$';
    };

    // Convert NPR to current currency
    const convertAmount = (amountInNPR) => {
        const amount = parseFloat(amountInNPR);
        if (isNaN(amount)) return 0;

        if (currency === 'NPR') {
            return amount;
        } else {
            return amount / EXCHANGE_RATE;
        }
    };

    const value = {
        currency,
        isPrivacyMode,
        setCurrency,
        toggleCurrency,
        togglePrivacyMode,
        formatAmount,
        getCurrencySymbol,
        convertAmount,
        EXCHANGE_RATE
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
