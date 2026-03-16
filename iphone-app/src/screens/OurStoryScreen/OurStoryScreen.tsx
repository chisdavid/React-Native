import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import PinkParticles from '../../components/PinkParticles';
import { beforeAfterCards, growthMoments, loveReasons } from '../../utils/ourStoryContent';
import { styles, ui } from './OurStoryScreen.styles';

const OurStoryScreen = () => {
    const [openReasonIndex, setOpenReasonIndex] = useState(0);
    const [openSections, setOpenSections] = useState({
        reasons: true,
        growth: false,
        beforeAfter: false,
    });

    const toggleReason = (index: number) => {
        setOpenReasonIndex((currentIndex) => (currentIndex === index ? -1 : index));
    };

    const toggleSection = (section: 'reasons' | 'growth' | 'beforeAfter') => {
        setOpenSections((currentSections) => ({
            ...currentSections,
            [section]: !currentSections[section],
        }));
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <PinkParticles />

                <View style={styles.heroCard}>
                    <View style={styles.heroBadge}>
                        <Ionicons name="sparkles" size={ui.iconSizeSm} color={ui.accent} />
                        <Text style={styles.heroBadgeText}>365 de zile de noi</Text>
                    </View>

                    <Text style={styles.title}>Un an cu tine</Text>
                    <Text style={styles.subtitle}>
                        Un an in care ai transformat zile obisnuite in amintiri si iubirea in locul meu preferat.
                    </Text>

                    <View style={styles.heroIconRow}>
                        <View style={styles.heroIconBubble}>
                            <Ionicons name="heart" size={ui.iconSizeMd} color={ui.accent} />
                        </View>
                        <View style={styles.heroIconBubbleWarm}>
                            <Ionicons name="sunny" size={ui.iconSizeMd} color={ui.warm} />
                        </View>
                        <View style={styles.heroIconBubbleSoft}>
                            <Ionicons name="sparkles" size={ui.iconSizeMd} color={ui.deep} />
                        </View>
                    </View>
                </View>

                <View style={[styles.sectionCard, !openSections.reasons && styles.sectionCardCollapsed]}>
                    <Pressable onPress={() => toggleSection('reasons')} style={styles.sectionToggle}>
                        <Text style={styles.sectionTitle}>12 motive pentru care te iubesc</Text>
                        <Ionicons
                            name={openSections.reasons ? 'chevron-up' : 'chevron-down'}
                            size={ui.iconSizeMd}
                            color={ui.deep}
                        />
                    </Pressable>

                    {openSections.reasons ? (
                        <>
                            <Text style={styles.sectionSubtitle}>
                                Cate unul pentru fiecare luna in care mi-ai facut viata mai frumoasa.
                            </Text>

                            <View style={styles.reasonList}>
                                {loveReasons.map((reason, index) => {
                                    const isOpen = openReasonIndex === index;

                                    return (
                                        <Pressable
                                            key={reason.monthLabel}
                                            onPress={() => toggleReason(index)}
                                            style={[styles.reasonCard, isOpen ? styles.reasonCardOpen : undefined]}
                                        >
                                            <View style={styles.reasonHeader}>
                                                <View style={styles.reasonIconWrap}>
                                                    <Ionicons name={reason.icon} size={ui.iconSizeMd} color={ui.accent} />
                                                </View>

                                                <View style={styles.reasonTextWrap}>
                                                    <Text style={styles.reasonMonth}>{reason.monthLabel}</Text>
                                                    <Text style={styles.reasonTitle}>{reason.title}</Text>
                                                </View>

                                                <Ionicons
                                                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                                                    size={ui.iconSizeMd}
                                                    color={ui.muted}
                                                />
                                            </View>

                                            {isOpen ? <Text style={styles.reasonDescription}>{reason.description}</Text> : null}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </>
                    ) : null}
                </View>

                <View style={[styles.sectionCardAccent, !openSections.growth && styles.sectionCardCollapsed]}>
                    <Pressable onPress={() => toggleSection('growth')} style={styles.sectionToggle}>
                        <Text style={styles.sectionTitle}>Cum m-ai schimbat in bine</Text>
                        <Ionicons
                            name={openSections.growth ? 'chevron-up' : 'chevron-down'}
                            size={ui.iconSizeMd}
                            color={ui.deep}
                        />
                    </Pressable>

                    {openSections.growth ? (
                        <View style={styles.growthList}>
                            {growthMoments.map((item) => (
                                <View key={item.title} style={styles.growthCard}>
                                    <View style={styles.growthIconWrap}>
                                        <Ionicons name={item.icon} size={ui.iconSizeMd} color={ui.growth} />
                                    </View>
                                    <View style={styles.growthTextWrap}>
                                        <Text style={styles.growthTitle}>{item.title}</Text>
                                        <Text style={styles.growthText}>{item.text}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : null}
                </View>

                <View style={[styles.sectionCardDark, !openSections.beforeAfter && styles.sectionCardDarkCollapsed]}>
                    <Pressable onPress={() => toggleSection('beforeAfter')} style={styles.sectionToggle}>
                        <Text style={styles.sectionTitleLight}>Before and after</Text>
                        <Ionicons
                            name={openSections.beforeAfter ? 'chevron-up' : 'chevron-down'}
                            size={ui.iconSizeMd}
                            color={ui.light}
                        />
                    </Pressable>

                    {openSections.beforeAfter ? (
                        <>
                            <Text style={styles.sectionSubtitleLight}>
                                Diferenta dintre cum eram inainte si cine am devenit dupa ce ai aparut tu.
                            </Text>

                            <View style={styles.beforeAfterGrid}>
                                {beforeAfterCards.map((card) => (
                                    <View key={card.title} style={styles.beforeAfterCard}>
                                        <View style={styles.beforeAfterIconWrap}>
                                            <Ionicons name={card.icon} size={ui.iconSizeMd} color={ui.light} />
                                        </View>
                                        <Text style={styles.beforeAfterTitle}>{card.title}</Text>

                                        <View style={styles.beforeAfterBlockMuted}>
                                            <Text style={styles.beforeAfterLabelMuted}>Inainte de tine</Text>
                                            <Text style={styles.beforeAfterTextMuted}>{card.beforeText}</Text>
                                        </View>

                                        <View style={styles.beforeAfterBlockBright}>
                                            <Text style={styles.beforeAfterLabelBright}>Dupa ce ai aparut tu</Text>
                                            <Text style={styles.beforeAfterTextBright}>{card.afterText}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : null}
                </View>
            </View>
        </ScrollView>
    );
};

export default OurStoryScreen;
