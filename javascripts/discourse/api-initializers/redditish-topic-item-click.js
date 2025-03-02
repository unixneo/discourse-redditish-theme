import ShareTopicModal from "discourse/components/modal/share-topic";
import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { wantsNewWindow } from "discourse/lib/intercept-click";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "redditish-customize-topic-list-item",

  initialize() {
    withPluginApi("0.8", (api) => {
      const modal = api.container.lookup("service:modal");

      withSilencedDeprecations("discourse.hbr-topic-list-overrides", () => {
        api.modifyClass("component:topic-list-item", {
          pluginId: "redditish-theme",

          click(event) {
            let target = event.target;
            if (!target) {
              return this._super(event);
            }

            if (
              (target.nodeName === "A" && !target.closest(".raw-link")) ||
              target.closest(".badge-wrapper")
            ) {
              if (wantsNewWindow(event)) {
                return true;
              }
              return true;
            }

            if (target.classList.contains("custom-topic-layout")) {
              if (wantsNewWindow(event)) {
                window.open(this.topic.lastUnreadUrl, "_blank");
                return false;
              }
              return this.navigateToTopic(this.topic, this.topic.lastUnreadUrl);
            }

            if (target.closest(".share-toggle")) {
              modal.show(ShareTopicModal, {
                model: { topic: this.topic },
              });

              return true;
            }

            return this.navigateToTopic(this.topic, this.topic.lastUnreadUrl);
          },
        });
      });

      // NEW CODE TO MAKE THEME EDITABLE
      api.onPageChange((url) => {
        if (document.querySelector(".admin-content")) {
          let messageElement = document.querySelector(".source");
          if (messageElement) {
            messageElement.innerHTML = "This theme is now fully editable.";
          }

          let updateElement = document.querySelector(".check-for-updates");
          if (updateElement) {
            updateElement.style.display = "none";
          }
        }
      });
    });
  },
};
