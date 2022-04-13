<template>
    <div>
        <div class="h-100 bg-plum-plate bg-animation">
            <div class="d-flex h-100 justify-content-center align-items-center">
                <b-col md="6" class="mx-auto app-login-box">
                    <div class="app-logo-inverse mx-auto mb-3"/>

                    <div class="modal-dialog w-100">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="h5 modal-title">
                                    Página não encontrada!
                                    <h6 class="mt-1 mb-0 opacity-8">
                                        <span>Pode ser que você esteja aqui por engano.</span>
                                    </h6>
                                </div>
                            </div>
                            <div class="modal-body">
                                <div class="text-center">
                                    <img width="50%" src="@/assets/images/responses/notfound.svg" alt="">
                                </div>
                                
                            </div>
                            <div class="modal-footer clearfix">
                                <div class="float-right">
                                    <router-link :to="{name: 'home'}"><b-button variant="primary" size="lg">Voltar</b-button></router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center text-white opacity-8 mt-3">
                        Toledo - Paraná
                    </div>
                </b-col>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "NotFound",
  components: {},
  data() {
    return {
      
    };
  },
  methods: {
    
  },
};
</script>

