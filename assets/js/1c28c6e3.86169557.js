"use strict";(self.webpackChunkscholarsome=self.webpackChunkscholarsome||[]).push([[464],{3905:(t,e,n)=>{n.d(e,{Zo:()=>p,kt:()=>c});var a=n(7294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},l=Object.keys(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var d=a.createContext({}),s=function(t){var e=a.useContext(d),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},p=function(t){var e=s(t.components);return a.createElement(d.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},u=a.forwardRef((function(t,e){var n=t.components,r=t.mdxType,l=t.originalType,d=t.parentName,p=i(t,["components","mdxType","originalType","parentName"]),u=s(n),c=r,k=u["".concat(d,".").concat(c)]||u[c]||m[c]||l;return n?a.createElement(k,o(o({ref:e},p),{},{components:n})):a.createElement(k,o({ref:e},p))}));function c(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=n.length,o=new Array(l);o[0]=u;var i={};for(var d in e)hasOwnProperty.call(e,d)&&(i[d]=e[d]);i.originalType=t,i.mdxType="string"==typeof t?t:r,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},520:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>d,default:()=>c,frontMatter:()=>i,metadata:()=>s,toc:()=>m});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),o=["components"],i={sidebar_position:2},d="Installation",s={unversionedId:"get-started/installation",id:"get-started/installation",title:"Installation",description:"Scholarsome can be installed one of two ways for production uses: via Docker Compose, or Docker.",source:"@site/docs/get-started/installation.md",sourceDirName:"get-started",slug:"/get-started/installation",permalink:"/get-started/installation",draft:!1,editUrl:"https://github.com/hwgilbert16/scholarsome/tree/develop/apps/docs/docs/get-started/installation.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"sidebar",previous:{title:"Prerequisites",permalink:"/get-started/prerequisites"},next:{title:"Development Guide",permalink:"/development/development-guide"}},p={},m=[{value:"Via Docker Compose",id:"via-docker-compose",level:2},{value:"Via a Docker Container",id:"via-a-docker-container",level:2},{value:"Outside a container",id:"outside-a-container",level:2}],u={toc:m};function c(t){var e=t.components,n=(0,r.Z)(t,o);return(0,l.kt)("wrapper",(0,a.Z)({},u,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"installation"},"Installation"),(0,l.kt)("p",null,"Scholarsome can be installed one of two ways for production uses: via Docker Compose, or Docker."),(0,l.kt)("p",null,"For individuals contributing to the development of Scholarsome, it is possible to directly run it outside a container. However, this method is only recommended for development uses."),(0,l.kt)("p",null,"This documentation is written assuming that the system Scholarsome is being installed on is ",(0,l.kt)("strong",{parentName:"p"},"Linux-based.")," Scholarsome is compatible with other platforms, but you will have to source your own installation instructions for non-Linux systems."),(0,l.kt)("admonition",{title:"Environment Files",type:"caution"},(0,l.kt)("p",{parentName:"admonition"},"For each installation method, there is a separate environment file. Ensure that the one downloaded matches your method of installation.")),(0,l.kt)("h2",{id:"via-docker-compose"},"Via Docker Compose"),(0,l.kt)("admonition",{title:"Recommended",type:"tip"},(0,l.kt)("p",{parentName:"admonition"},"This is the recommended method of installation, as it is does not require any external database connections.")),(0,l.kt)("p",null,"Make a directory for the necessary files."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"mkdir ~/scholarsome && cd ~/scholarsome\n")),(0,l.kt)("p",null,"Download the compose file."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/compose.yml\n")),(0,l.kt)("p",null,"Download the environment file and make a copy of it."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/.env.compose.example && cp .env.compose.example .env\n")),(0,l.kt)("p",null,"Open ",(0,l.kt)("inlineCode",{parentName:"p"},".env")," with your favorite text editor, and fill in the required fields, along with any optional ones that fit your use case."),(0,l.kt)("admonition",{type:"info"},(0,l.kt)("p",{parentName:"admonition"},"If the SMTP fields are left blank, users will be verified by default. Most installations do not need email verification.")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Variable Name"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"NODE_ENV"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Declares whether the application is running in development or production. Recommended to be set to ",(0,l.kt)("inlineCode",{parentName:"td"},"production"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"DATABASE_PASSWORD"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Internal password for databases. Select something strong, as you will not need to know this.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"JWT_SECRET"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"HTTP_PORT"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"STORAGE_TYPE"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," The method that Scholarsome will store media files, either ",(0,l.kt)("inlineCode",{parentName:"td"},"local")," or ",(0,l.kt)("inlineCode",{parentName:"td"},"s3"),". If set to local, Scholarsome will store media files locally.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_HOST"),(0,l.kt)("td",{parentName:"tr",align:null},"Host to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_PORT"),(0,l.kt)("td",{parentName:"tr",align:null},"Port to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_USERNAME"),(0,l.kt)("td",{parentName:"tr",align:null},"Username to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_PASSWORD"),(0,l.kt)("td",{parentName:"tr",align:null},"Password to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"HOST"),(0,l.kt)("td",{parentName:"tr",align:null},"The domain to be used in emails. ",(0,l.kt)("strong",{parentName:"td"},"Do not include HTTP."))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SSL_KEY_BASE64"),(0,l.kt)("td",{parentName:"tr",align:null},"Base64 encoded SSL public key.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SSL_CERT_BASE64"),(0,l.kt)("td",{parentName:"tr",align:null},"Base64 encoded SSL certificate.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SCHOLARSOME_RECAPTCHA_SITE"),(0,l.kt)("td",{parentName:"tr",align:null},"reCAPTCHA site key.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SCHOLARSOME_RECAPTCHA_SECRET"),(0,l.kt)("td",{parentName:"tr",align:null},"reCAPTCHA secret key.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SCHOLARSOME_HEAD_SCRIPTS_BASE64"),(0,l.kt)("td",{parentName:"tr",align:null},"Base64 encoded HTML of any scripts that should be included in the head tag for every page.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ENDPOINT"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. The endpoint of the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. Access key for the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. Secret key for the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. Region for the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. The name of the bucket being used in S3 to store media files.")))),(0,l.kt)("p",null,"Start the service in a detached state."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"docker compose --env-file .env up -d\n")),(0,l.kt)("p",null,"Scholarsome is now running."),(0,l.kt)("h2",{id:"via-a-docker-container"},"Via a Docker Container"),(0,l.kt)("admonition",{type:"caution"},(0,l.kt)("p",{parentName:"admonition"},"For this installation method, you will have to provide your own database connections.")),(0,l.kt)("p",null,"Make a directory for the necessary files."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"mkdir ~/scholarsome && cd ~/scholarsome\n")),(0,l.kt)("p",null,"Pull the image."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"docker pull hwgilbert16/scholarsome\n")),(0,l.kt)("p",null,"Download the environment file and make a copy of it."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/.env.docker.example && cp .env.docker.example .env\n")),(0,l.kt)("p",null,"Open ",(0,l.kt)("inlineCode",{parentName:"p"},".env")," with your favorite text editor, and fill in the required fields, along with any optional ones that fit your use case."),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Variable Name"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"NODE_ENV"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Declares whether the application is running in development or production. Recommended to be set to ",(0,l.kt)("inlineCode",{parentName:"td"},"production"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"DATABASE_URL"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Connection string to the MySQL database. The format should be as follows: ",(0,l.kt)("inlineCode",{parentName:"td"},"mysql://(username):(password)@(host):(port)/(database)"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"JWT_SECRET"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"HTTP_PORT"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"STORAGE_TYPE"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," The method that Scholarsome will store media files, either ",(0,l.kt)("inlineCode",{parentName:"td"},"local")," or ",(0,l.kt)("inlineCode",{parentName:"td"},"s3"),". If set to local, Scholarsome will store media files locally.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"REDIS_HOST"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Host used to access the Redis database.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"REDIS_PORT"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Port used to access the Redis database.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"REDIS_USERNAME"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Username used to access the Redis database.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"REDIS_PASSWORD"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"Required.")," Password used to access the Redis database.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_HOST"),(0,l.kt)("td",{parentName:"tr",align:null},"Host to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_PORT"),(0,l.kt)("td",{parentName:"tr",align:null},"Port to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_USERNAME"),(0,l.kt)("td",{parentName:"tr",align:null},"Username to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SMTP_PASSWORD"),(0,l.kt)("td",{parentName:"tr",align:null},"Password to access the SMTP server.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"HOST"),(0,l.kt)("td",{parentName:"tr",align:null},"The domain to be used in emails. ",(0,l.kt)("strong",{parentName:"td"},"Do not include HTTP."))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SSL_KEY_BASE64"),(0,l.kt)("td",{parentName:"tr",align:null},"Base64 encoded SSL public key.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SSL_CERT_BASE64"),(0,l.kt)("td",{parentName:"tr",align:null},"Base64 encoded SSL certificate.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SCHOLARSOME_RECAPTCHA_SITE"),(0,l.kt)("td",{parentName:"tr",align:null},"reCAPTCHA site key.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SCHOLARSOME_RECAPTCHA_SECRET"),(0,l.kt)("td",{parentName:"tr",align:null},"reCAPTCHA secret key.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"SCHOLARSOME_HEAD_SCRIPTS_BASE64"),(0,l.kt)("td",{parentName:"tr",align:null},"Base64 encoded HTML of any scripts that should be included in the head tag for every page.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"STORAGE_LOCAL_DIR"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files locally. The absolute filepath pointing to the directory where Scholarsome should store media files.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ENDPOINT"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. The endpoint of the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. Access key for the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. Secret key for the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. Region for the S3 service.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"S3_STORAGE_ACCESS_KEY"),(0,l.kt)("td",{parentName:"tr",align:null},"Required if storing files in S3. The name of the bucket being used in S3 to store media files.")))),(0,l.kt)("p",null,"Start the container in a detached state. Replace ",(0,l.kt)("inlineCode",{parentName:"p"},"(port)")," with the value you selected for ",(0,l.kt)("inlineCode",{parentName:"p"},"HTTP_PORT")," in the environment file."),(0,l.kt)("admonition",{type:"warning"},(0,l.kt)("p",{parentName:"admonition"},"You must set ",(0,l.kt)("inlineCode",{parentName:"p"},"STORAGE_LOCAL_DIR")," to ",(0,l.kt)("inlineCode",{parentName:"p"},"/data")," if you are planning to use the example command below.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"mkdir ~/scholarsome-media && docker run -d --env-file .env -p (port):(port) -v ~/scholarsome-media:/data --restart=always --name scholarsome hwgilbert16/scholarsome\n")),(0,l.kt)("p",null,"To stop the container, run:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"docker stop scholarsome\n")),(0,l.kt)("h2",{id:"outside-a-container"},"Outside a container"),(0,l.kt)("p",null,"Reference the ",(0,l.kt)("a",{parentName:"p",href:"/development/development-guide"},"development guide")," for steps on how to run Scholarsome outside a container."))}c.isMDXComponent=!0}}]);