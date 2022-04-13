<template>
    <div class="d-flex">
        <div class="header-btn-lg pr-0">
            <div class="widget-content p-0">
                <div class="widget-content-wrapper">
                    <div class="widget-content-left text-right  mr-3 header-user-info">
                        <div class="widget-heading">{{ userName }}</div>
                        <div class="widget-subheading">{{ roles }}</div>
                    </div>
                    <div class="widget-content-right">
                        <b-dropdown toggle-class="p-0" menu-class="dropdown-menu-lg" variant="link" right>
                            <span slot="button-content">
                                <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                                    <img width="42" class="rounded-circle" src="@/assets/images/avatars/default.png" alt="">
                                </div>
                            </span>
                            <button type="button" tabindex="0" class="dropdown-item">Minha conta</button>
                            <div tabindex="-1" class="dropdown-divider"></div>
                            <button type="button" tabindex="0" class="dropdown-item" @click="logout()">Logout</button>
                        </b-dropdown>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import { mapActions } from "vuex";
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faAngleDown,
        faCalendarAlt,
        faTrashAlt,
        faCheck,
        faFileAlt,
        faCloudDownloadAlt,
        faFileExcel,
        faFilePdf,
        faFileArchive,
        faEllipsisH,
    } from '@fortawesome/free-solid-svg-icons'
    

    library.add(
        faAngleDown,
        faCalendarAlt,
        faTrashAlt,
        faCheck,
        faFileAlt,
        faCloudDownloadAlt,
        faFileExcel,
        faFilePdf,
        faFileArchive,
        faEllipsisH,
    );

    export default {
        components: {
            
        },
        data() {
            return {
                userName: '',
                roles : '' 
            };
        },
        mounted() {
            this.userName = this.$store.getters.StateUser ? this.$store.getters.StateUser.name : '';
            this.roles = this.$store.getters.StateRoles ? this.$store.getters.StateRoles.at(-1) : ''; 
        },

        methods: {
            ...mapActions(["LogOut"]),
            async logout(){
                await this.LogOut();
                this.$router.push({name:"login"});
            }
        }
    }


</script>
