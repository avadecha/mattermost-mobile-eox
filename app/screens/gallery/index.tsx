// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useMemo, useRef, useState} from 'react';
import {NativeModules, useWindowDimensions, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {useGalleryControls} from '@hooks/gallery';
import {dismissModal} from '@screens/navigation';
import {freezeOtherScreens} from '@utils/gallery';

import Footer from './footer';
import Gallery, {GalleryRef} from './gallery';
import Header from './header';

type Props = {
    galleryIdentifier: string;
    hideActions: boolean;
    initialIndex: number;
    items: GalleryItemType[];
}

const GalleryScreen = ({galleryIdentifier, hideActions, initialIndex, items}: Props) => {
    const dim = useWindowDimensions();
    const isTablet = useIsTablet();
    const theme = useTheme();
    const [localIndex, setLocalIndex] = useState(initialIndex);
    const {setControlsHidden, headerStyles, footerStyles} = useGalleryControls();
    const dimensions = useMemo(() => ({width: dim.width, height: dim.height}), [dim.width]);
    const galleryRef = useRef<GalleryRef>(null);

    const onClose = useCallback(() => {
        // We keep the un freeze here as we want
        // the screen to be visible when the gallery
        // starts to dismiss as the hanlder for shouldHandleEvent
        // of the lightbox is not called
        freezeOtherScreens(false);
        requestAnimationFrame(() => {
            galleryRef.current?.close();
        });
    }, []);

    const close = useCallback(() => {
        if (Platform.OS === 'ios' && !isTablet) {
            // We need both the navigation & the module
            Navigation.setDefaultOptions({
                layout: {
                    orientation: ['portrait'],
                },
            });
            NativeModules.MattermostManaged.lockPortrait();
        }
        freezeOtherScreens(false);
        requestAnimationFrame(async () => {
            dismissModal({
                componentId: Screens.GALLERY,
                layout: {
                    orientation: isTablet ? undefined : ['portrait'],
                },
                statusBar: {
                    visible: true,
                    backgroundColor: theme.sidebarBg,
                },
            });
        });
    }, [isTablet]);

    const onIndexChange = useCallback((index: number) => {
        setLocalIndex(index);
    }, []);

    return (
        <>
            <Header
                index={localIndex}
                onClose={onClose}
                style={headerStyles}
                total={items.length}
            />
            <Gallery
                galleryIdentifier={galleryIdentifier}
                initialIndex={initialIndex}
                items={items}
                onHide={close}
                onIndexChange={onIndexChange}
                onShouldHideControls={setControlsHidden}
                ref={galleryRef}
                targetDimensions={dimensions}
            />
            <Footer
                hideActions={hideActions}
                item={items[localIndex]}
                style={footerStyles}
            />
        </>
    );
};

export default GalleryScreen;