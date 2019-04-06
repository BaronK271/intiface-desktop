import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { FrontendConnector } from "intiface-core-library";
import { IntifaceProtocols } from "intiface-protocols";

@Component({})
export default class UpdateDialog extends Vue {
  @Prop()
  private connector!: FrontendConnector;

  @Prop()
  private dialogVerb!: string;

  @Prop()
  private dialogType!: string[];

  private dialogName: string = "";

  private showDialog: boolean = false;
  private installationProgress: number = 0;
  private installationStep: string = "Downloading update...";
  private isDownloading: boolean = false;
  private newApplicationDownloaded: boolean = false;

  @Watch("showDialog")
  public async Update() {
    if (!this.showDialog) {
      return;
    }
    this.isDownloading = true;
    try {
      this.connector.addListener("progress", this.UpdateDownloadProgress);
      if (this.dialogType.includes("engine")) {
        this.dialogName = "Engine";
        await this.connector.UpdateEngine();
      }
      if (this.dialogType.includes("application")) {
        this.dialogName = "Application";
        await this.connector.UpdateApplication();
      }
      if (this.dialogType.includes("devicefile")) {
        this.dialogName = "Device File";
        await this.connector.UpdateDeviceFile();
      }
    } finally {
      this.connector.removeListener("progress", this.UpdateDownloadProgress);
      this.isDownloading = false;

      // TODO Emit on download success
      this.$emit("finished");
    }
  }

  private UpdateDownloadProgress(aMsg: IntifaceProtocols.IntifaceBackendMessage.DownloadProgress) {
    this.installationProgress = Math.ceil(((aMsg.bytesReceived!) / aMsg.bytesTotal!) * 100);
  }
}