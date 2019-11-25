import { Component, OnInit } from '@angular/core';
import { ApiService} from '../api.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.page.html',
  styleUrls: ['./listagem.page.scss'],
})
export class ListagemPage implements OnInit {

  public posts: any;
  public results: any;
  public count: any;
  public next: any;

  // public page:any;
  // public total_page:any;

  constructor(private apiService: ApiService, private modalController: ModalController, private alertController: AlertController, private router: Router) {

    this.next = 1;

    this.apiService.getPosts(this.next).subscribe((results:any)=>{
      console.log(results);
      this.count = results.count;
      this.posts = results.results;
      });
 
    }

  loadMoreData(event) {

    this.count++;

    this.apiService.getPosts(this.next).subscribe((results:any)=>{
      this.posts = this.posts.concat(results.results);

      event.target.complete();
      if (this.count == this.next) {
        event.target.disabled = true;
      }
    });
  }

  async presentModal(post) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'name': post.name,
        'url': post.url,
        'modalController': this.modalController
      }
    });
    return await modal.present();
  }



  async edit(post) {

    let navigationExtras: NavigationExtras = {
      state: {
        formDataParams: post
      }
    };
    this.router.navigate(['/formulario'], navigationExtras);
  }

   //  let dadosPessoa = {
   //    "name": "Dryca Gata",
   //    "job": "Garota de Programação"
   //  }

   // await this.apiService.sendPutRequest(dadosPessoa, post.id).subscribe((results)=>{
   //    console.log(results);
   //  }, error => {
   //    console.log(error);
   //  });

   //  const alert = await this.alertController.create({
   //    header: 'Alerta!',
   //    subHeader: 'Formulário API',
   //    message: 'Dados editados ('+post.first_name+' '+ post.last_name+') com sucesso.',
   //    buttons: ['OK']
   //  });



    async delete(post){

      await this.apiService.sendDeleteRequest(post.id).subscribe((results)=>{
      console.log(results);
      let index = this.posts.indexOf(post);
      this.posts.splice(index, 1);
    }, error => {
      console.log(error);
    });

    //   await this.apiService.sendDeleteRequest(post.id).subscribe((results)=>{
    //   console.log(results);
    // }, error => {
    //   console.log(error);
    
    const alert = await this.alertController.create({
      header: 'Alerta!',
      subHeader: 'Formulário API Deletado!',
      message: 'Dados removidos com sucesso.',
      buttons: ['OK']
    });

        await alert.present();

  
  }

  ngOnInit(){

  }

}
