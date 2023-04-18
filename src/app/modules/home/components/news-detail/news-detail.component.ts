import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService, UserModel } from 'src/app/modules/auth';
import { orderBy } from 'lodash-es';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface INewsDetailModel {
  tenBaiViet: string,
  ngayTao: string,
  tenNguoiDang: string,
  noiDung: string
}

interface IImageModel {
  image: string,
  thumbImage: string,
  title: string,
  id: string
}

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {

  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  avatarPic = 'none';
  isLoading$: Observable<boolean>;

  public NewsDetailModel: INewsDetailModel = {
    tenBaiViet: "",
    ngayTao: "",
    tenNguoiDang: "",
    noiDung: ""
  };

  public imageModel: IImageModel = {
    image: "",
    thumbImage: "",
    title: "",
    id: ""
  };

  public ListVanBan: any[];
  public imageObject: Array<IImageModel> = [];

  constructor(
    public api: ApiService,
    private router: Router,
    private userService: AuthService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
  ) {
    this.isLoading$ = this.userService.isLoadingSubject.asObservable();
    this.aRoute.params.subscribe(data => {
      this.getInfoNews(data.id);
      this.getRelatedNews(data.id);
      this.getListVanBan(data.id);
    })
  }

  ngOnInit(): void {
    const sb = this.userService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
    });
    this.subscriptions.push(sb);
  }

  public imageClick(item) {
    this.router.navigate(['/detail/', item?.baiVietId]);
  }

  public getInfoNews(Id) {
    const query = {
      BaiVietId: Id,
    }
    this.api.get('/api/BaiVietDetail', query)
      .subscribe((res: any) => {
        if (res) {
          this.NewsDetailModel = res;
          this.cdf.detectChanges();
          this.removeStyleImgInContent();
        }
      })
  }

  public getRelatedNews(Id) {
    const query = {
      BaiVietId: Id,
    }
    this.api.get('/api/BaiVietDetail/tin-lien-quan', query).subscribe((res: any) => {
      if (res) {
        this.imageObject = res?.items?.map(m => ({...m, title: m?.tenBaiViet, url: m?.anhDaiDien}));
        this.imageObject = orderBy(this.imageObject, 'id', 'desc');
        this.cdf.detectChanges();
      }
    })
  }

  public getListVanBan(Id) {
    const query = {
      BaiVietId: Id,
    }
    this.api.get('/api/BaiVietDetail/tin-lien-quan', query).subscribe((res: any) => {
      if (res) {
        this.ListVanBan = res?.items;
        this.cdf.detectChanges();
      }
    })
  }

  public showChiTietVanBanDinhChe(id) {
    this.router.navigate(['/detail/', id]);
  }

  /**
   * Remove style
   */
  private removeStyleImgInContent() {
    const imgEl = document.getElementById('remove_style_img');
    const selected = imgEl.querySelectorAll('img');
    selected?.forEach(el => {
      el.removeAttribute("style");
    });
  }
}
