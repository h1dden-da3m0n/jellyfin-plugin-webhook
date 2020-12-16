﻿export default function (view) {
    /*** Utils ***/
    /**
     * Determine if a collection contains an object.
     * @param a {Array}
     * @param b {Object}
     * @return {boolean}
     */
    const collectionHas = function (a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] === b) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param elm {EventTarget}
     * @param selector {string}
     * @returns {HTMLElement}
     */
    const findParentBySelector = function (elm, selector) {
        const all = document.querySelectorAll(selector);
        let cur = elm.parentNode;
        //keep going up until you find a match
        while (cur && !collectionHas(all, cur)) {
            cur = cur.parentNode;
        }
        return cur;
    }

    const Webhook = {
        pluginId: "529397D0-A0AA-43DB-9537-7CFDE936C1E3",

        configurationWrapper: document.querySelector("#configurationWrapper"),

        baseConfig: {
            template: document.querySelector("#template-base"),
            addConfig: function (template, name) {
                const collapse = document.createElement("div");
                collapse.setAttribute("is", "emby-collapse");
                collapse.setAttribute("title", name);
                collapse.dataset.configWrapper = "1";
                const collapseContent = document.createElement("div");
                collapseContent.classList.add("collapseContent");

                // Append template content.
                collapseContent.appendChild(template);

                // Append removal button.
                const btnRemove = document.createElement("button");
                btnRemove.innerText = "Remove";
                btnRemove.setAttribute("is", "emby-button");
                btnRemove.classList.add("raised", "button-warning", "block");
                btnRemove.addEventListener("click", Webhook.removeConfig);

                collapseContent.appendChild(btnRemove);
                collapse.appendChild(collapseContent);

                return collapse;
            },
            setConfig: function (config, element) {
                element.querySelector("[data-name=chkEnableMovies]").checked = config.EnableMovies || true;
                element.querySelector("[data-name=chkEnableEpisodes]").checked = config.EnableEpisodes || true;
                element.querySelector("[data-name=chkEnableSeasons]").checked = config.EnableSeasons || true;
                element.querySelector("[data-name=chkEnableSeries]").checked = config.EnableSeries || true;
                element.querySelector("[data-name=chkEnableAlbums]").checked = config.EnableAlbums || true;
                element.querySelector("[data-name=chkEnableSongs]").checked = config.EnableSongs || true;
                element.querySelector("[data-name=txtWebhookUri]").value = config.WebhookUri || "";
                element.querySelector("[data-name=txtTemplate]").value = atob(config.Template || "");
            },
            getConfig: function (element) {
                const config = {};

                config.EnableMovies = element.querySelector("[data-name=chkEnableMovies]").checked || false;
                config.EnableEpisodes = element.querySelector("[data-name=chkEnableEpisodes]").checked || false;
                config.EnableSeasons = element.querySelector("[data-name=chkEnableSeasons]").checked || false;
                config.EnableSeries = element.querySelector("[data-name=chkEnableSeries]").checked || false;
                config.EnableAlbums = element.querySelector("[data-name=chkEnableAlbums]").checked || false;
                config.EnableSongs = element.querySelector("[data-name=chkEnableSongs]").checked || false;
                config.WebhookUri = element.querySelector("[data-name=txtWebhookUri]").value || "";
                config.Template = btoa(element.querySelector("[data-name=txtTemplate]").value || "");

                return config;
            }
        },
        discord: {
            btnAdd: document.querySelector("#btnAddDiscord"),
            template: document.querySelector("#template-discord"),
            defaultEmbedColor: "#AA5CC3",
            addConfig: function (config) {
                const template = document.createElement("div");
                template.dataset.type = "discord";
                template.appendChild(Webhook.baseConfig.template.cloneNode(true).content);
                template.appendChild(Webhook.discord.template.cloneNode(true).content);

                const txtColor = template.querySelector("[data-name=txtEmbedColor]");
                const selColor = template.querySelector("[data-name=EmbedColor]");
                txtColor.addEventListener("input", function () {
                    selColor.value = value;
                });
                selColor.addEventListener("change", function () {
                    txtColor.value = value;
                });

                const baseConfig = Webhook.baseConfig.addConfig(template, "Discord");
                Webhook.configurationWrapper.appendChild(baseConfig);

                // Load configuration.
                Webhook.discord.setConfig(config, baseConfig);
            },
            setConfig: function (config, element) {
                Webhook.baseConfig.setConfig(config, element);
                element.querySelector("[data-name=txtAvatarUrl]").value = config.AvatarUrl || "";
                element.querySelector("[data-name=txtUsername]").value = config.Username || "";
                element.querySelector("[data-name=ddlMentionType]").value = config.MentionType || "None";
                element.querySelector("[data-name=txtEmbedColor]").value = config.EmbedColor || Webhook.discord.defaultEmbedColor;
                element.querySelector("[data-name=EmbedColor]").value = config.EmbedColor || Webhook.discord.defaultEmbedColor;
            },
            getConfig: function (e) {
                const config = Webhook.baseConfig.getConfig(e);
                config.AvatarUrl = e.querySelector("[data-name=txtAvatarUrl]").value || "";
                config.Username = e.querySelector("[data-name=txtUsername]").value || "";
                config.MentionType = e.querySelector("[data-name=ddlMentionType]").value || "";
                config.EmbedColor = e.querySelector("[data-name=txtEmbedColor]").value || "";
                return config;
            }
        },
        gotify: {
            btnAdd: document.querySelector("#btnAddGotify"),
            template: document.querySelector("#template-gotify"),
            addConfig: function (config) {
                const template = document.createElement("div");
                template.dataset.type = "gotify";
                template.appendChild(Webhook.baseConfig.template.cloneNode(true).content);
                template.appendChild(Webhook.gotify.template.cloneNode(true).content);

                const baseConfig = Webhook.baseConfig.addConfig(template, "Gotify");
                Webhook.configurationWrapper.appendChild(baseConfig);

                // Load configuration.
                Webhook.gotify.setConfig(config, baseConfig);
            },
            setConfig: function (config, element) {
                Webhook.baseConfig.setConfig(config, element);
                element.querySelector("[data-name=txtToken]").value = config.Token || "";
                element.querySelector("[data-name=txtPriority]").value = config.Priority || 0;
            },
            getConfig: function (e) {
                const config = Webhook.baseConfig.getConfig(e);
                config.Token = e.querySelector("[data-name=txtToken]").value || "";
                config.Priority = e.querySelector("[data-name=txtPriority]").value || 0;
                return config;
            }
        },
        pushover: {
            btnAdd: document.querySelector("#btnAddPushover"),
            template: document.querySelector("#template-pushover"),
            addConfig: function (config) {
                const template = document.createElement("div");
                template.dataset.type = "pushover";
                template.appendChild(Webhook.baseConfig.template.cloneNode(true).content);
                template.appendChild(Webhook.pushover.template.cloneNode(true).content);

                const baseConfig = Webhook.baseConfig.addConfig(template, "Pushover");
                Webhook.configurationWrapper.appendChild(baseConfig);

                // Load configuration
                Webhook.pushover.setConfig(config, baseConfig);
            },
            setConfig: function (config, element) {
                Webhook.baseConfig.setConfig(config, element);
                element.querySelector("[data-name=txtToken]").value = config.Token || "";
                element.querySelector("[data-name=txtUserToken]").value = config.UserToken || "";
                element.querySelector("[data-name=txtDevice]").value = config.Device || "";
                element.querySelector("[data-name=txtTitle]").value = config.Title || "";
                element.querySelector("[data-name=txtMessageUrl]").value = config.MessageUrl || "";
                element.querySelector("[data-name=txtMessageUrlTitle]").value = config.MessageUrlTitle || "";
                element.querySelector("[data-name=ddlMessagePriority]").value = config.MessagePriority || "";
                element.querySelector("[data-name=ddlNotificationSound]").value = config.NotificationSound || "";
            },
            getConfig: function (e) {
                const config = Webhook.baseConfig.getConfig(e);
                config.Token = e.querySelector("[data-name=txtToken]").value || "";
                config.UserToken = e.querySelector("[data-name=txtUserToken]").value || "";
                config.Device = e.querySelector("[data-name=txtDevice]").value || "";
                config.Title = e.querySelector("[data-name=txtTitle]").value || "";
                config.MessageUrl = e.querySelector("[data-name=txtMessageUrl]").value || "";
                config.MessageUrlTitle = e.querySelector("[data-name=txtMessageUrlTitle]").value || "";
                config.MessagePriority = e.querySelector("[data-name=ddlMessagePriority]").value || 0;
                config.NotificationSound = e.querySelector("[data-name=ddlNotificationSound]").value || "";
                return config;
            }
        },
        generic: {
            btnAdd: document.querySelector("#btnAddGeneric"),
            template: document.querySelector("#template-generic"),
            templateGenericValue: document.querySelector("#template-generic-value"),
            addConfig: function (config) {
                const template = document.createElement("div");
                template.dataset.type = "generic";
                template.appendChild(Webhook.baseConfig.template.cloneNode(true).content);
                template.appendChild(Webhook.generic.template.cloneNode(true).content);

                const baseConfig = Webhook.baseConfig.addConfig(template, "Generic");
                Webhook.configurationWrapper.appendChild(baseConfig);
                template.querySelector("[data-name=btnAddHeader]").addEventListener("click", function () {
                    Webhook.generic.addHeader(baseConfig, {});
                });
                template.querySelector("[data-name=btnAddField]").addEventListener("click", function () {
                    Webhook.generic.addField(baseConfig, {});
                });

                // Load configuration
                Webhook.generic.setConfig(config, baseConfig);
            },
            setConfig: function (config, element) {
                Webhook.baseConfig.setConfig(config, element);
                console.log(config);
                for (let i = 0; i < config.Headers.length; i++) {
                    Webhook.generic.addHeader(element, config.Headers[i]);
                }

                for (let i = 0; i < config.Fields.length; i++) {
                    Webhook.generic.addField(element, config.Fields[i]);
                }
            },
            getConfig: function (e) {
                const config = Webhook.baseConfig.getConfig(e);
                const fieldValues = document
                    .querySelector("[data-name=field-wrapper]")
                    .querySelectorAll("[data-name=value]");

                config.Fields = [];
                for (let i = 0; i < fieldValues.length; i++) {
                    config.Fields.push({
                        Key: fieldValues[i].querySelector("[data-name=txtKey]").value,
                        Value: fieldValues[i].querySelector("[data-name=txtValue]").value
                    });
                }

                const headerValues = document
                    .querySelector("[data-name=header-wrapper]")
                    .querySelectorAll("[data-name=value]");

                config.Headers = [];
                for (let i = 0; i < headerValues.length; i++) {
                    config.Headers.push({
                        Key: headerValues[i].querySelector("[data-name=txtKey]").value,
                        Value: headerValues[i].querySelector("[data-name=txtValue]").value
                    });
                }

                return config;
            },
            addHeader: function (element, config) {
                const template = document.createElement("div");
                template.appendChild(Webhook.generic.templateGenericValue.cloneNode(true).content);

                console.log(config);
                template.querySelector("[data-name=txtKey]").value = config.Key || "";
                template.querySelector("[data-name=txtValue]").value = config.Value || "";
                
                element.querySelector("[data-name=header-wrapper]").appendChild(template);
            },
            addField: function (element, config) {
                const template = document.createElement("div");
                template.appendChild(Webhook.generic.templateGenericValue.cloneNode(true).content);

                console.log(config);
                template.querySelector("[data-name=txtKey]").value = config.Key || "";
                template.querySelector("[data-name=txtValue]").value = config.Value || "";
                
                element.querySelector("[data-name=field-wrapper]").appendChild(template);
            }
        },

        init: function () {
            // Add click handlers
            Webhook.discord.btnAdd.addEventListener("click", Webhook.discord.addConfig);
            Webhook.gotify.btnAdd.addEventListener("click", Webhook.gotify.addConfig);
            Webhook.pushover.btnAdd.addEventListener("click", Webhook.pushover.addConfig);
            Webhook.generic.btnAdd.addEventListener("click", Webhook.generic.addConfig);
            document.querySelector("#saveConfig").addEventListener("click", Webhook.saveConfig);

            Webhook.loadConfig();
        },
        removeConfig: function (e) {
            e.preventDefault();
            findParentBySelector(e.target, '[data-config-wrapper]').remove();
        },
        saveConfig: function (e) {
            e.preventDefault();

            Dashboard.showLoadingMsg();

            const config = {};
            config.ServerUrl = document.querySelector("#txtServerUrl").value;
            config.DiscordOptions = [];
            const discordConfigs = document.querySelectorAll("[data-type=discord]");
            for (let i = 0; i < discordConfigs.length; i++) {
                config.DiscordOptions.push(Webhook.discord.getConfig(discordConfigs[i]));
            }

            config.GotifyOptions = [];
            const gotifyConfigs = document.querySelectorAll("[data-type=gotify]");
            for (let i = 0; i < gotifyConfigs.length; i++) {
                config.GotifyOptions.push(Webhook.gotify.getConfig(gotifyConfigs[i]));
            }

            config.PushoverOptions = [];
            const pushoverConfigs = document.querySelectorAll("[data-type=pushover]");
            for (let i = 0; i < pushoverConfigs.length; i++) {
                config.PushoverOptions.push(Webhook.pushover.getConfig(pushoverConfigs[i]));
            }

            config.GenericOptions = [];
            const genericConfigs = document.querySelectorAll("[data-type=generic]");
            for (let i = 0; i < genericConfigs.length; i++) {
                config.GenericOptions.push(Webhook.generic.getConfig(genericConfigs[i]));
            }

            window.ApiClient.updatePluginConfiguration(Webhook.pluginId, config).then(Dashboard.processPluginConfigurationUpdateResult);
        },
        loadConfig: function () {
            Dashboard.showLoadingMsg();

            window.ApiClient.getPluginConfiguration(Webhook.pluginId).then(function (config) {
                document.querySelector("#txtServerUrl").value = config.ServerUrl || "";
                for (let i = 0; i < config.DiscordOptions.length; i++) {
                    Webhook.discord.addConfig(config.DiscordOptions[i]);
                }

                for (let i = 0; i < config.GotifyOptions.length; i++) {
                    Webhook.gotify.addConfig(config.GotifyOptions[i]);
                }

                for (let i = 0; i < config.PushoverOptions.length; i++) {
                    Webhook.pushover.addConfig(config.PushoverOptions[i]);
                }

                for (let i = 0; i < config.GenericOptions.length; i++) {
                    Webhook.generic.addConfig(config.GenericOptions[i]);
                }
            });

            Dashboard.hideLoadingMsg()
        }
    }

    view.addEventListener("viewshow", function (e) {
        Webhook.init();
    });
}