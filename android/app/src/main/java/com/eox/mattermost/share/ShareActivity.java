package com.eox.mattermost.share;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.eox.mattermost.rnbeta.MainApplication;

public class ShareActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "MattermostShare";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MainApplication app = (MainApplication) this.getApplication();
        app.sharedExtensionIsOpened = true;
    }
}
