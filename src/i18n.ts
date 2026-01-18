import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !['en', 'ko', 'ja'].includes(locale)) {
        locale = 'ko';
    }

    const common = (await import(`../messages/${locale}/common.json`)).default;
    const party = (await import(`../messages/${locale}/party.json`)).default;
    const cohort = (await import(`../messages/${locale}/cohort.json`)).default;
    const epidemiology = (await import(`../messages/${locale}/epidemiology.json`)).default;
    const portfolio = (await import(`../messages/${locale}/portfolio.json`)).default;
    const chatbot = (await import(`../messages/${locale}/chatbot.json`)).default;

    return {
        locale,
        messages: {
            ...common,
            PartySaaS: party,
            CohortDashboard: cohort,
            EasyEpidemiology: epidemiology,
            Portfolio: portfolio,
            chatbot: chatbot
        }
    };
});

