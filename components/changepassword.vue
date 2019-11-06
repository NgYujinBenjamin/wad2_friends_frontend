<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <button
          class="v-btn v-btn--contained v-btn--rounded theme--dark elevation-0 v-size--x-small secondary float-right"
          size="x-small"
          dark
          @click.stop="dialog=true"
        >
          <span class="v-btn__content">
            <span>
              <i class="far fa-edit"></i>
            </span>
          </span>
        </button>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Password</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="New Password*" v-model="newpassword" type="password" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Re-type New Password*"
                  v-model="retypenewPassword"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="updatePassword()">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    newpassword: "",
    retypenewPassword: ""
  }),
  methods: {
    updatePassword() {
      if (this.newpassword == this.retypenewPassword) {
        this.$toast.success("Password successfully updated!", {
          icon: { name: "thumbs-up" }
        });
      }
      this.dialog = false;
    }
  }
};
</script>