import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, map } from 'rxjs/operators';

import { GithubApiService } from '../shared/github-api.service';
import { User } from '../shared/github-api.model';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit {

  githubForm: FormGroup;
  search: FormControl;
  users: Observable<User[]>;

  constructor(
    private github: GithubApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.githubForm = this.fb.group({
      search: ['']
    });
    // this.users = this.github.getUsers();
    this.search = (this.githubForm.get('search') as FormControl);


    this.users = this.search.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(users => {
        const params = new HttpParams().set('q', users);
        return this.github.search<User>('users', params).pipe(
          map(result => result.items)
        );
      })
    );
  }

}
