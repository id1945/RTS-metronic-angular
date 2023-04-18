# HYUNDAI | TC MOTOR
# Angular version 11

#### Clone git to work/code https://git-scm.com/downloads

```
- git clone https://gitlab.com/id1945/RTS-metronic-angular.git
```

#### Setup https://nodejs.org/en/download

```
- npm install -g @angular/cli
- npm install
- npm start
```

#### Commit/Update document

```bash
- git add “path_file”
- git commit -m “Commit message”
- git push origin “branch”
```

#### Build for deploy

```bash
- npm run build --prod
```

#### Angular CLI

```bash
- ng g module my-module
- ng g module my-module --routing
- ng g component my-component
- ng g directive my-directive
- ng g pipe my-pipe
- ng g class my-class
- ng g interface my-interface
- ng g enum my-enum
- ng destroy component app-component
```

#### Structures

```
├───app
│   ├───modules
│   │   ├───administration
│   │   │   ├───businesstrip-list
│   │   │   ├───delivery-list
│   │   │   ├───importparcel-list
│   │   │   ├───parcel-list
│   │   │   ├───register-cut-rice
│   │   │   ├───registervehicle-list
│   │   │   └───stationery-list
│   │   ├───auth
│   │   │   ├───login
│   │   │   ├───_models
│   │   │   └───_services
│   │   ├───category
│   │   │   ├───bussinesstype-list
│   │   │   ├───department-list
│   │   │   ├───district-list
│   │   │   ├───driver-list
│   │   │   ├───meetingroom-list
│   │   │   ├───newstype-list
│   │   │   ├───position-list
│   │   │   ├───posts-listl
│   │   │   ├───productype-list
│   │   │   ├───province-list
│   │   │   ├───unit-list
│   │   │   └───vehicle-list
│   │   ├───contacts
│   │   │   ├───contacts-list
│   │   │   ├───intro
│   │   │   └───personal-information
│   │   ├───documents
│   │   │   ├───agencypolicy-list
│   │   │   ├───internalreport-list
│   │   │   ├───librarylaw-list
│   │   │   ├───numberdocs-list
│   │   │   ├───regime-list
│   │   │   └───regime-propose-list
│   │   ├───errors
│   │   │   ├───error1
│   │   │   └───error6
│   │   ├───health
│   │   │   └───declaration
│   │   ├───home
│   │   │   └───components
│   │   │       ├───news
│   │   │       ├───news-detail
│   │   │       └───overview
│   │   ├───it-request
│   │   │   └───request-list
│   │   ├───KPI
│   │   │   ├───criterion-kpi-list
│   │   │   ├───kpi-list
│   │   │   ├───library-kpi-list
│   │   │   ├───target-kpi-list
│   │   │   ├───target-kpi-parts-list
│   │   │   │   └───components
│   │   │   │       ├───detail-kpi-parts
│   │   │   │       │   └───components
│   │   │   │       │       ├───approve-target-kpi-parts-modal
│   │   │   │       │       ├───comment-modal
│   │   │   │       │       ├───e-kpi-list
│   │   │   │       │       ├───e-plan-list
│   │   │   │       │       └───e-target-list
│   │   │   │       └───form-kpi-parts-modal
│   │   │   ├───target-report
│   │   │   └───update-kpi-detail
│   │   ├───management
│   │   │   ├───documents-list
│   │   │   ├───flows-list
│   │   │   ├───groups-list
│   │   │   ├───photo-library-list
│   │   │   ├───popup-list
│   │   │   ├───posts-list
│   │   │   ├───users-list
│   │   │   ├───vibers-list
│   │   │   └───video-library-list
│   │   ├───meeting-schedule
│   │   │   └───meeting-calendar
│   │   ├───personnel
│   │   │   ├───mission-list
│   │   │   ├───monthplan-list
│   │   │   ├───rest-overtime
│   │   │   │   ├───approve-rest-overtime
│   │   │   │   ├───explanation
│   │   │   │   ├───register-rest-overtime
│   │   │   │   └───shared
│   │   │   ├───salary
│   │   │   └───timesheet
│   │   ├───purchase
│   │   │   ├───contract-list
│   │   │   ├───purchase-list
│   │   │   └───supplier-selection-list
│   │   ├───submissions
│   │   │   ├───promulgate-list
│   │   │   ├───regime-list
│   │   │   ├───requests-payment-list
│   │   │   └───submissions-list
│   │   ├───translate
│   │   │   ├───language
│   │   │   └───screen
│   │   └───user-profile
│   │       └───profile-overview
│   ├───pages
│   │   ├───builder
│   │   └───_layout
│   │       ├───components
│   │       │   ├───aside
│   │       │   ├───aside-dynamic
│   │       │   ├───footer
│   │       │   ├───header
│   │       │   ├───header-mobile
│   │       │   └───topbar
│   │       └───init
│   │           └───scipts-init
│   └───_metronic
│       ├───configs
│       ├───core
│       │   ├───pipes
│       │   ├───services
│       │   └───utils
│       ├───partials
│       └───shared
│           ├───angular-calendar
│           │   ├───calendar-header
│           │   └───context-menu
│           ├───crop-image
│           │   └───crop-image
│           ├───http
│           ├───i18n
│           │   └───vocabs
│           ├───ng-zorro-antd
│           ├───paging
│           │   ├───models
│           │   └───ng-pagination
│           ├───shared
│           │   ├───common
│           │   ├───components
│           │   │   ├───basic-content-modal
│           │   │   ├───confirm-input-basic
│           │   │   ├───confirm-input-file
│           │   │   ├───import-file-template
│           │   │   ├───link-file
│           │   │   ├───select-file
│           │   │   ├───select-tags-button
│           │   │   ├───setting-column-modal
│           │   │   ├───table
│           │   │   └───time-line-approve
│           │   ├───directives
│           │   ├───models
│           │   ├───pipes
│           │   └───services
│           ├───slider
│           │   └───image-slider
│           └───sso
├───assets
│   ├───env
│   ├───fonts
│   ├───i18n
│   ├───js
│   ├───media
│   ├───plugins
│   ├───sass
│   └───static-page
└───environments
```

###### SSO Auth Config https://github.com/id1945/angular12-wso2-is-sso

```json
{
    "isLoginNormal": true,
    "sso": {
        "clientId": "P9eYEJ4rj8qxueLA42E153BgGFoa",
        "redirectUri": "http://localhost:4200/callback",
        "issuer": "https://sso.tcmotor.vn/oauth2/token", 
        "loginUrl":  "https://sso.tcmotor.vn/oauth2/authorize",
        "logoutUrl":  "https://sso.tcmotor.vn/oidc/logout",
        "tokenEndpoint": "https://sso.tcmotor.vn/oauth2/token",
        "userinfoEndpoint":  "https://sso.tcmotor.vn/oauth2/userinfo",
        "requireHttps": false,
        "requestAccessToken": true,
        "disableAtHashCheck": false,
        "showDebugInformation": true,
        "scope": "openid",
        "responseType": "id_token token",
        "//": "****************************************",
        "//": "3c12L0gw3dwgWtdIvTchBSkqluQa",
        "//": "http://portal-dev.hyundai.tcmotor.vn/callback",
        "//": "P9eYEJ4rj8qxueLA42E153BgGFoa",
        "//": "http://localhost:4200/callback",
        "//": "****************************************"
    }
}
```

###### Proxy Config

```typescript
module.exports = {
  "/api/*": {
    target: "http://portal-dev.hyundai.tcmotor.vn:88",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  "/notification/*": {
    target: "http://portal-dev.hyundai.tcmotor.vn:88",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  // Nhân sự
  "/API/Mobile/*": {
    target: "http://10.32.35.20:89",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  // Dropbox show qrcode download app
  "/htv_get_link_app/*": {
    target: "https://work.hyundai.tcmotor.vn",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  // Màn Hỗ trợ CNTT
  "/tcm_ticket/*": {
    target: "https://irm.tcmotor.vn",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
};

```

#### IIS Config (server for root)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
   <system.webServer>
      <rewrite>
         <rules>
            <clear />
            <rule name="ReverseProxyInboundRule1" stopProcessing="true">
               <match url=".*" ignoreCase="false" />
               <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
                  <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                  <add input="{REQUEST_URI}" pattern="^/(API/Mobile/)" negate="true" />
                  <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
                  <add input="{REQUEST_URI}" pattern="^/(notification)" negate="true" />
                  <add input="{REQUEST_URI}" pattern="^/(htv_get_link_app)" negate="true" />
                  <add input="{REQUEST_URI}" pattern="^/(tcm_ticket)" negate="true" />
               </conditions>
               <action type="Rewrite" url="/index.html" />
            </rule>
            <rule name="ReverseProxyInboundRule2" stopProcessing="true">
               <match url="API/Mobile/(.*)" />
               <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
               <action type="Rewrite" url="http://10.32.35.20:89/API/Mobile/{R:1}" logRewrittenUrl="true" />
            </rule>
            <rule name="ReverseProxyInboundRule3" stopProcessing="true">
               <match url="api/(.*)" />
               <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
               <action type="Rewrite" url="http://portal-dev.hyundai.tcmotor.vn:88/api/{R:1}" />
            </rule>
            <rule name="ReverseProxyInboundRule4" stopProcessing="true">
               <match url="notification/(.*)" />
               <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
               <action type="Rewrite" url="http://portal-dev.hyundai.tcmotor.vn:88/notification/{R:1}" />
            </rule>
            <rule name="ReverseProxyInboundRule5" stopProcessing="true">
               <match url="htv_get_link_app/(.*)" />
               <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
               <action type="Rewrite" url="https://work.hyundai.tcmotor.vn/htv_get_link_app/{R:1}" />
            </rule>
            <rule name="ReverseProxyInboundRule6" stopProcessing="true">
               <match url="tcm_ticket/(.*)" />
               <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
               <action type="Rewrite" url="https://irm.tcmotor.vn/tcm_ticket/{R:1}" />
            </rule>
         </rules>
      </rewrite>
      <security>
         <requestFiltering>
            <requestLimits maxAllowedContentLength="2147483647"/>
         </requestFiltering>
      </security>
   </system.webServer>
</configuration>
```

#### Contributors

🥇 DaiDH ☎: 0845.882.882\
🥉 HungHT ☎: 0947.910.998

###### Support by Metronic https://github.com/id1945/metronic-admin

#### © 2022 Copyright – All Rights Reserved
