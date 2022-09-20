class UsersController < ApplicationController

  # authenticate the user which will ensure only logged in users are able to access these methods
  before_action :authenticate_user, except: [:index, :allData, :all_chat_rooms, :create]
  
  def current
    render json: current_user
  end




  def new
  end

  def create

    user = User.create(
      email: params[:email],
      screen_name: params[:screen_name],
      password: params[:password],
      password_confirmation: params[:password_confirmation],
      avatar: params[:avatar],
      location: params[:location],
      is_admin: params[:is_admin]
    )


    if user.errors.any?
      render json: {error: user.errors.full_messages}, status: 422

    else

      if user.persisted?
        auth_token = Knock::AuthToken.new payload: {sub: user.id}
        render json: {
          user: user,
          auth_token: auth_token
        }
      else
        # 'Unprocessable Entity', i.e. force an HTTP error code
        render json: {error: 'Could not create new user'}, status: 422
      end
    end
    
  end # create

  def index
    @users = User.all

    respond_to do |format|
      format.html
      format.json{render json: @users}
    end
  end # index

  def show
    # for frontend test
    user = User.last
    render json:user
  end

  def friends
    @user = User.find params[:id]    
    render json: @user, include: [:posts, :chatrooms, :comments, :messages, :urls, :following, :followers]

  end
  

  def all_chat_rooms
    # for frontend test
    user = current_user
    
    if user.present?
      rooms = user.chatrooms
      render json:rooms
    end
end

  def edit
  end

  def update
  end

  def destroy
  end

  def allData
    @users = User.all

    respond_to do |format|
      format.html
      format.json{render json: @users, include: [:posts, :chatrooms, :comments, :messages, :urls, :following, :followers]}
    end
  end

  private
  
  def user_params
    params.require(:user).permit(:screen_name, :email, :password, :password_confirmation, :avatar, :location, :is_admin )
  end # user_params

   
end # class UsersController
