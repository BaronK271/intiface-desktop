import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import UpdateDialog from "../UpdateDialog/UpdateDialog";
import router from "../../router";
import { FrontendConnector, IntifaceConfiguration, IntifaceUtils } from "intiface-core-library";
import { IntifaceProtocols } from "intiface-protocols";

@Component({
  components: {
    UpdateDialog,
  },
})
export default class SetupPanel extends Vue {
  private setupStep: number = 0;
  @Prop()
  private connector!: FrontendConnector;
  @Prop()
  private config!: IntifaceConfiguration;

  private GoToIntiface() {
    this.config.HasRunSetup = true;
    router.push("/");
  }

  private async StartCertServer() {
    await this.connector.GenerateCertificate();
    await this.connector.RunCertificateAcceptanceServer();
  }
}
